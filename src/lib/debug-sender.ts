import { Sender, Data } from "./data_transporter"

export default class DebugSender implements Sender {
  async send(dataList: Data[]): Promise<any> {
    console.log(JSON.stringify(dataList))
  }
}
