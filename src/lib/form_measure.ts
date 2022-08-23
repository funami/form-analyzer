import DataTransporter, { Sender } from "./data_transporter"
import { get, set } from "local-storage"
import EventEmitter from "events"
import GaConnect from "./ga_connect"
import { v4 as uuidv4 } from "uuid"
import { waitAppearTarget, getElementValue } from "./dom-utils"
import HttpSender from "./http-sender"
import DebugSender from "./debug-sender"

type FormMeasureOption = {
  window: Window
  formSelector?: string
  sendGtagEvent?: boolean
  localstoragePrefix?: string
  dataSender?: Sender
  senderUrl?: string
}

export type FieldEvent = {
  n: string // field name
  t: string | null // field type
  nn: string // field node name. ex. `input`
  v?: string | number | boolean | null // field value
  vl?: number | null // field value length
  c?: boolean | null // field checked
}
export type FormEvent = FieldEvent & {
  i: number // event sequence. unique by formSessionId
  fst: string // form selector
  sid: string // form session id
  uid: string // user id(anonymous)
  ts: number // timestamp millisecond
  e: string // event name
}
type PageProps = {
  url: string
  referer: string
  ua: string
}

export default class FormMeasure {
  private sequence: number = 0
  private eventEmitter = new EventEmitter()
  private sessionId: number = 0
  private _uid: string | undefined
  private formSelector: string
  private window: Window
  private senderUrl?: string

  private _sender?: Sender
  private _dataTransporter?: DataTransporter
  public appPrefix = "_fe"

  constructor(opt: FormMeasureOption) {
    this.window = opt.window
    if (opt.sendGtagEvent === undefined || opt.sendGtagEvent === true) {
      this.on("form_session_start", GaConnect.formSessionStart)
    }
    if (opt.localstoragePrefix) this.appPrefix = opt.localstoragePrefix
    this.formSelector = opt.formSelector || "form"
    this.senderUrl = opt.senderUrl
    this._sender = opt.dataSender
    this.init()
  }
  sender(): Sender {
    if (!this._sender) {
      if (!this.senderUrl) {
        this._sender = new DebugSender()
      } else {
        this._sender = new HttpSender({
          window: this.window,
          url: this.senderUrl,
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
  nextSequence() {
    return this.sequence++
  }
  nextSessionId() {
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

  private emit(eventName: string, param?: FieldEvent | PageProps) {
    const _param = param || {}
    const e = {
      e: eventName,
      i: this.nextSequence(),
      fst: this.formSelector,
      sid: this.sessionId,
      uid: this.uid,
      ts: Date.now(),
      ..._param,
    }
    this.dataTransporter()?.push(e)
    this.eventEmitter.emit(eventName, e)
  }
  on(message: string, cb: (e: FormEvent) => void) {
    this.eventEmitter.on(message, cb)
  }

  init() {
    const document = this.window.document
    this.window.addEventListener("unload", () => {
      this.end()
    })
    const form = document.querySelector(this.formSelector)
    if (form) {
      document
        .querySelectorAll(`${this.formSelector} input,select,textarea`)
        .forEach((v, i) => {
          const elemet = v as HTMLElement
          const type = elemet.getAttribute("type")?.toLowerCase() || null
          const nodeName = elemet.nodeName.toUpperCase()
          const name = v.getAttribute("name")

          if (
            (nodeName == "INPUT" && (type == "hidden" || type == null)) ||
            !name
          )
            return
          const fieldEventEmitter = (e: Event) => {
            const value = getElementValue(elemet)
            if (
              !(nodeName == "SELECT" || type == "radio" || type == "checkbox")
            ) {
              delete value.v
            }
            const eventParam = {
              n: name,
              t: type,
              e: e.type,
              nn: nodeName,
              ...value,
            }
            this.emit(e.type, eventParam)
          }
          elemet.addEventListener("change", fieldEventEmitter)
          elemet.addEventListener("focus", fieldEventEmitter)
        })
      form.addEventListener("submit", (e) => {
        this.emit("form_submit")
      })
    }
  }

  start() {
    this.sequence = 0
    this.nextSessionId()
    if (this.dataTransporter()) {
      this.dataTransporter().flashInterval = 10000
      this.dataTransporter().start()
    }
    this.emit("form_session_start", {
      url: this.window.location.href,
      ua: this.window.navigator.userAgent,
      referer: this.window.document.referrer,
    })
    waitAppearTarget(this.window, this.formSelector).then(() => {
      this.emit("form_appear")
    })
  }

  end() {
    this.dataTransporter()?.end()
    this.emit("form_session_end")
  }
}
