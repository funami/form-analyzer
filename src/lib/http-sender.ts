import { Sender, Data } from "./data_transporter"

export default class HttpSender implements Sender {
  public window: Window
  public url: string
  constructor(props: { window: Window; url: string }) {
    this.window = props.window
    this.url = props.url
  }
  async send(dataList: Data[]): Promise<any> {
    return this.window.navigator.sendBeacon(this.url, JSON.stringify(dataList))
  }
}
