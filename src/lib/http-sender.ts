import { Sender, Data } from "./data_transporter"

export default class HttpSender implements Sender {
  public window: Window
  public url: string
  constructor(props: { window: Window; url: string }) {
    this.window = props.window
    this.url = props.url
  }
  async send(dataList: Data[]): Promise<any> {
    const data = new Blob([JSON.stringify(dataList)], {
      type: "application/json",
    })
    return this.window.navigator.sendBeacon(this.url, data)
  }
}
