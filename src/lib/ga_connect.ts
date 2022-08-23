import { FormEvent } from "./form_measure"
export default class GaConnect {
  static formSessionStart(e: FormEvent) {
    const event = {
      event: `form_session_start`,
      form_session_id: e.sid,
      form_uid: e.uid,
    }
    if (!window.dataLayer) window.dataLayer = []
    window.dataLayer.push(event)
  }
}
