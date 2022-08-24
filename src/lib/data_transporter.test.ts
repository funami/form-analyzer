import DataTransporter from "./data_transporter"
import DebugSender from "./debug-sender"

const testData1 = {
  eventIndex: 0,
  transactionId: 100,
  name: "radio[name='test']",
  event: "forcus",
  timestamp: 12345,
  val: 1,
}
const testData2 = {
  eventIndex: 1,
  transactionId: 100,
  name: "radio[name='test']",
  event: "change",
  timestamp: 12346,
  val: 2,
}
const testData3 = {
  eventIndex: 2,
  transactionId: 101,
  name: "radio[name='test2']",
  event: "forcus",
  timestamp: 12347,
  val: 1,
}
const testData4 = {
  eventIndex: 3,
  transactionId: 101,
  name: "radio[name='test2']",
  event: "forcus",
  timestamp: 12347,
  val: 1,
}

const sender = new DebugSender()
const mockSend = jest.fn(() => Promise.resolve(true))
sender.send = mockSend
beforeEach(() => {
  jest.useFakeTimers()
  mockSend.mockClear()
})
afterEach(() => {
  jest.useRealTimers()
})

test("push", () => {
  const dt = new DataTransporter(sender)
  expect(dt.dataList).toEqual([])
  expect(dt.nextFlashIndex).toEqual(0)

  dt.push(testData1)
  expect(dt.dataList).toEqual([testData1])
  expect(dt.nextFlashIndex).toEqual(0)

  dt.push(testData2)
  expect(dt.dataList).toEqual([testData1, testData2])
  expect(dt.nextFlashIndex).toEqual(0)
  expect(sender.send).toBeCalledTimes(0)
})

describe("flash", () => {
  let dt: DataTransporter
  beforeEach(() => {
    dt = new DataTransporter(sender)
  })

  test("データが蓄積されてない送信しない", async () => {
    dt = new DataTransporter(sender)
    expect(dt.flashing).toEqual(false)
    expect(dt.dataList).toEqual([])
    expect(dt.nextFlashIndex).toEqual(0)
    expect(dt.dataList.length).toEqual(0)

    await expect(dt.flash()).resolves.toBeUndefined()
    expect(sender.send).not.toBeCalled()
    expect(dt.dataList).toEqual([])
    expect(dt.nextFlashIndex).toEqual(0)
  })

  test("データ投入されていると送信される", async () => {
    expect(dt.flashing).toEqual(false)
    dt.push(testData1)
    dt.push(testData2)
    expect(dt.dataList).toEqual([testData1, testData2])
    expect(dt.nextFlashIndex).toEqual(0)
    expect(dt.dataList.length).toEqual(2)

    await expect(dt.flash()).resolves.toEqual(true)

    expect(dt.dataList).toEqual([testData1, testData2])
    expect(dt.nextFlashIndex).toEqual(2)
    expect(sender.send).toBeCalledTimes(1)
    expect(sender.send).toBeCalledWith([testData1, testData2])

    mockSend.mockClear()
    await expect(dt.flash()).resolves.toBeUndefined()
    expect(dt.dataList).toEqual([testData1, testData2])
    expect(dt.nextFlashIndex).toEqual(2)
    expect(sender.send).not.toBeCalled()
  })

  test("flashing", async () => {
    dt.push(testData1)
    expect(dt.dataList).toEqual([testData1])
    expect(dt.nextFlashIndex).toEqual(0)
    expect(sender.send).not.toBeCalled()

    // flashingを trueにして flash をよぶ
    dt.flashing = true
    expect(dt.flashing).toEqual(true)
    await expect(dt.flash()).rejects.toThrowError("aleady flashing")
    expect(dt.dataList).toEqual([testData1])
    expect(dt.nextFlashIndex).toEqual(0)
    expect(sender.send).not.toBeCalled()

    // flashingを trueにして flash をよぶ
    dt.flashing = false
    await expect(dt.flash()).resolves.toEqual(true)
    expect(dt.dataList).toEqual([testData1])
    expect(dt.nextFlashIndex).toEqual(1)
    expect(sender.send).toBeCalledTimes(1)
    expect(sender.send).toBeCalledWith([testData1])
  })

  test("send fail", async () => {
    let res = false
    const sender = new DebugSender()
    const mockSend = jest.fn(() => Promise.resolve(res))
    sender.send = mockSend
    dt = new DataTransporter(sender)

    dt.push(testData1)
    expect(dt.flashing).toEqual(false)
    expect(dt.dataList).toEqual([testData1])
    expect(dt.nextFlashIndex).toEqual(0)
    expect(sender.send).not.toBeCalled()

    res = false // send fail
    await expect(dt.flash()).resolves.toEqual(false)
    expect(dt.dataList).toEqual([testData1])
    expect(dt.nextFlashIndex).toEqual(0)
    expect(sender.send).toBeCalledTimes(1)
    expect(sender.send).toBeCalledWith([testData1])

    res = true // send success
    await expect(dt.flash()).resolves.toEqual(true)
    expect(dt.dataList).toEqual([testData1])
    expect(dt.nextFlashIndex).toEqual(1)
    expect(sender.send).toBeCalledTimes(2)
    expect(sender.send).toBeCalledWith([testData1])
  })
})

test("start/end", async () => {
  const dt = new DataTransporter(sender)
  dt.flash = jest.fn()

  // テストデータ投入
  dt.push(testData1)
  dt.push(testData2)

  expect(dt.flash).toBeCalledTimes(0)

  dt.start()
  expect(dt.flash).toBeCalledTimes(1) // start直後1回呼ばれる

  jest.runOnlyPendingTimers() // setIntervalを実行することで flashする
  expect(dt.flash).toBeCalledTimes(2) // よばれる

  jest.runOnlyPendingTimers() // setIntervalを実行することで flashする
  expect(dt.flash).toBeCalledTimes(3) // よばれる

  dt.end()
  expect(dt.flash).toBeCalledTimes(4) // end直後1回呼ばれる

  jest.runOnlyPendingTimers() // setIntervalを実行することで flashする
  expect(dt.flash).toBeCalledTimes(4) // よばれない

  jest.runOnlyPendingTimers() // setIntervalを実行することで flashする
  expect(dt.flash).toBeCalledTimes(4) // よばれない

  dt.start()
  expect(dt.flash).toBeCalledTimes(5) // start直後1回呼ばれる

  jest.runOnlyPendingTimers() // setIntervalを実行することで flashする
  expect(dt.flash).toBeCalledTimes(6) // よばれる
})

describe("end", () => {
  test("endを呼び出すと、flashされる", async () => {
    const dt = new DataTransporter(sender)
    // テストデータ投入
    dt.push(testData1)
    dt.push(testData2)
    expect(dt.dataList).toEqual([testData1, testData2])
    expect(dt.nextFlashIndex).toEqual(0)
    expect(sender.send).not.toBeCalled()
    expect(sender.send).toBeCalledTimes(0)

    dt.end()
    expect(sender.send).toBeCalled()
    expect(sender.send).toBeCalledTimes(1)
    expect(sender.send).toBeCalledWith([testData1, testData2])
  })
})
