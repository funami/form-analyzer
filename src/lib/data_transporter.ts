/*
 * Data Buffer for form event
 */

export type Data = Record<string, any>

export interface Sender {
  send: (dataList: Data[]) => Promise<boolean>
}

export default class DataTransporter {
  readonly dataList: Data[] = []
  public nextFlashIndex = 0
  private tid?: NodeJS.Timeout
  public flashInterval = 5000
  private sender: Sender
  public flashing: boolean = false

  constructor(sender: Sender) {
    this.sender = sender
  }
  public push(data: Data): void {
    this.dataList.push(data)
  }
  public start(): void {
    this.flash()
    this.tid = setInterval(() => {
      this.flash()
    }, this.flashInterval)
  }
  public async end(): Promise<void> {
    if (this.tid) {
      clearInterval(this.tid)
      this.tid = undefined
    }
    await this.flash()
  }
  /*
   * this.dataListのnextFlashIndexから、最後までを送信する
   */
  public async flash(): Promise<boolean | undefined> {
    if (this.flashing) {
      throw new Error("aleady flashing")
    }
    this.flashing = true
    const startIndex = this.nextFlashIndex
    if (this.nextFlashIndex != this.dataList.length) {
      const nextIndex = this.dataList.length
      const sendData = this.dataList.slice(startIndex, nextIndex)
      const result = await this.sender.send(sendData)
      if (result) this.nextFlashIndex = nextIndex
      this.flashing = false
      return result
    } else {
      this.flashing = false
      return undefined
    }
  }
}
