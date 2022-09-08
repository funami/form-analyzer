import DataTransporter, { Sender } from "./data_transporter"
import { get, set } from "local-storage"
import EventEmitter from "events"
import GaConnect from "./ga_connect"
import { v4 as uuidv4 } from "uuid"
import {
  waitAppearTarget,
  WaitAppearTargetOption,
  getFieldValue,
} from "./dom-utils"
import HttpSender, { HttpSenderOption } from "./http-sender"
import DebugSender from "./debug-sender"
import { getCssSelector } from "css-selector-generator"

export type FormMeasureOption = {
  window: Window
  formSelector?: string
  sendGtagEvent?: boolean
  localstoragePrefix?: string
  dataSender?: Sender
  httpSenderOption?: HttpSenderOption
  waitAppearTargetOption?: WaitAppearTargetOption
}

type FieldProps = {
  n: string // field name
  t: string | null // field type
  nn: string // field node name. ex. `input`
  v?: string | number | boolean | null // field value
  vl?: number | null // field value length
  c?: boolean | null // field checked
}
export type FormEvent = FieldProps & {
  i: number // event sequence. unique by formSessionId
  fst: string // form selector
  sid: string // form session id
  uid: string // user id(anonymous)
  ts: number // timestamp millisecond
  e: string // event name
}
type FormProps = {
  url: string
  referer: string
  ua: string
  fda: FormValues
  fid: string
}

type FormValues = Record<string, any>

export default class FormMeasure {
  private sequence: number = 0
  private eventEmitter = new EventEmitter()
  private sessionId: number = 0
  private _uid: string | undefined
  private formSelector: string
  private window: Window
  private httpSenderOption?: HttpSenderOption
  private waitAppearTargetOption: WaitAppearTargetOption
  private _sender?: Sender
  private _dataTransporter?: DataTransporter
  public appPrefix = "_fe"

  private formAvailable = false

  constructor(opt: FormMeasureOption) {
    this.window = opt.window
    if (opt.sendGtagEvent === undefined || opt.sendGtagEvent === true) {
      this.on("form_session_start", GaConnect.formSessionStart)
    }
    if (opt.localstoragePrefix) this.appPrefix = opt.localstoragePrefix
    this.formSelector = opt.formSelector || "form"
    this.httpSenderOption = opt.httpSenderOption
    this._sender = opt.dataSender
    this.waitAppearTargetOption = opt.waitAppearTargetOption || {}
  }

  /**
   * senderの取得
   * @return Senderを返す。constractorで Senderを渡さない場合は、defaultは DebugSender(), senderUrlをセットすることで HttpSenderを作成して返す
   */
  sender(): Sender {
    if (!this._sender) {
      if (!this.httpSenderOption) {
        this._sender = new DebugSender()
      } else {
        this._sender = new HttpSender({
          window: this.window,
          option: this.httpSenderOption,
        })
      }
    }
    return this._sender
  }
  dataTransporter(): DataTransporter {
    if (!this._dataTransporter) {
      this._dataTransporter = new DataTransporter(this.sender())
    }
    return this._dataTransporter
  }
  incrementSequence() {
    return this.sequence++
  }
  incrementSessionId() {
    const currentSessionId = get<number>(`${this.appPrefix}_sid`) || 0
    this.sessionId = currentSessionId
    set<number>(`${this.appPrefix}_sid`, this.sessionId + 1)
    return this.sessionId
  }
  get uid(): string {
    if (!this._uid) {
      this._uid = get<string>(`${this.appPrefix}_uid`)
      if (!this._uid) {
        const idLength = 8
        const _uuid = uuidv4()
        const start = Math.round(
          Math.random() *
            (_uuid.length > idLength ? _uuid.length - idLength : 0)
        )
        const uuid = _uuid.replace(/-/g, "").substring(start, start + idLength)
        this._uid = `${uuid}.${Math.round(Date.now() / 1000)}`
        set<string>(`${this.appPrefix}_uid`, this._uid)
      }
    }
    return this._uid
  }
  private emit(eventName: string, param?: FieldProps | FormProps) {
    const _param = param || {}
    const e = {
      e: eventName,
      i: this.incrementSequence(),
      fst: this.formSelector,
      sid: this.sessionId,
      uid: this.uid,
      ts: Date.now(),
      ..._param,
    }
    console.debug("form measure event emitted", e)
    this.dataTransporter()?.push(e)
    this.eventEmitter.emit(eventName, e)
  }

  on(message: string, cb: (e: FormEvent) => void) {
    this.eventEmitter.on(message, cb)
  }

  start(): boolean {
    const document = this.window.document
    const formList = document.querySelectorAll(this.formSelector)
    if (formList.length > 0) {
      this.formAvailable = true
    }
    if (!this.formAvailable) return false

    this.window.addEventListener("unload", () => {
      this.emit("form_session_end")
      this.dataTransporter()?.end()
    })

    this.sequence = 0
    this.incrementSessionId()

    formList.forEach((_form, i) => {
      const form = _form as HTMLFormElement
      const fid = this.getFormId(form, i)
      this.emit("form_session_start", this.getFormProps(form, fid))

      const fieldEventEmitter = (e: Event) => {
        const props = this.sanitaizeFieldProps(
          this.getFieldProps(e.target as HTMLElement)
        )
        this.emit(e.type, { fid, ...props })
      }
      form.querySelectorAll("input,select,textarea").forEach((v) => {
        const elemet = v as HTMLElement

        elemet.addEventListener("change", fieldEventEmitter)
        elemet.addEventListener("focus", fieldEventEmitter)
      })

      form.addEventListener("submit", (e) => {
        this.emit("form_submit", this.getFormProps(form, fid))
      })
      waitAppearTarget(this.window, form, this.waitAppearTargetOption).then(
        () => {
          this.emit("form_appear", this.getFormProps(form, fid))
        }
      )
    })
    if (this.dataTransporter()) {
      this.dataTransporter().flashInterval = 10000
      this.dataTransporter().start()
    }
    return true
  }

  getFormId(form: HTMLFormElement, index = 0): string {
    return form.getAttribute("id")
      ? `form#${form.getAttribute("id")}`
      : form.getAttribute("name")
      ? `form[name='${form.getAttribute("name")}']`
      : form.getAttribute("class")
      ? `form.${form.getAttribute("class")}`
      : form.getAttribute("action")
      ? `form[action='${form.getAttribute("action")}']`
      : `FORM_INDEX[${index}]`
  }
  getFormProps(
    form: HTMLFormElement,
    fid: string,
    samitized = true
  ): FormProps {
    return {
      url: this.window.location.href,
      ua: this.window.navigator.userAgent,
      referer: this.window.document.referrer,
      fda: this.getFormDataSanitaized(form),
      fid,
    }
  }
  getFormDataSanitaized(form: HTMLFormElement): FieldProps[] {
    return this.getFormData(form).map((props) =>
      this.sanitaizeFieldProps(props)
    )
  }

  getFormData(form: HTMLFormElement): FieldProps[] {
    const ret: FieldProps[] = []
    form?.querySelectorAll(`input,select,textarea`).forEach((_elemet) => {
      const elemet = _elemet as HTMLElement
      const props = this.getFieldProps(elemet)
      ret.push(props)
    })
    return ret
  }

  getFieldProps(element: HTMLElement): FieldProps {
    const type = element.getAttribute("type")?.toLowerCase() || null
    const nodeName = element.nodeName.toUpperCase()
    const name = element.getAttribute("name") || getCssSelector(element)

    const value = getFieldValue(element)
    const props = {
      n: name,
      t: type,
      nn: nodeName,
      ...value,
    }
    return props
  }

  private sanitaizeFieldProps(e: FieldProps): FieldProps {
    if (e.nn != "SELECT" && e.t != "radio" && e.t != "checkbox") {
      delete e.v
    }
    return e
  }
}
