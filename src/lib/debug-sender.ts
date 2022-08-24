import { Sender, Data } from "./data_transporter"

export default class DebugSender implements Sender {
  async send(dataList: Data[]) {
    console.log(JSON.stringify(dataList))
    return true
  }
}
