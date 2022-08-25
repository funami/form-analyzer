import { Sender, Data } from "./data_transporter"

export type HttpSenderOption = {
  url: string
  api_key?: string
}
export default class HttpSender implements Sender {
  public window: Window
  public option: HttpSenderOption
  constructor(props: { window: Window; option: HttpSenderOption }) {
    this.window = props.window
    this.option = props.option
  }

  async send(dataList: Data[]): Promise<any> {
    const url = new URL(this.option.url)
    if (this.option.api_key)
      url.searchParams.set("api_key", this.option.api_key)
    const headers = {
      type: "application/json",
    }
    const data = new Blob([JSON.stringify(dataList)], headers)
    return this.window.navigator.sendBeacon(url.toString(), data)
  }
}
