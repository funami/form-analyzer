import DataTransporter, { Sender } from "./data_transporter"
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

const mockSender = new DebugSender()
beforeEach(() => {
  jest.useFakeTimers()
})
afterEach(() => {
  jest.useRealTimers()
})

test("push", () => {
  const dt = new DataTransporter(mockSender)
  expect(dt.dataList).toEqual([])
  expect(dt.nextFlashIndex).toEqual(0)

  dt.push(testData1)
  expect(dt.dataList).toEqual([testData1])
  expect(dt.nextFlashIndex).toEqual(0)

  dt.push(testData2)
  expect(dt.dataList).toEqual([testData1, testData2])
  expect(dt.nextFlashIndex).toEqual(0)
  expect(mockSender).toBeCalledTimes(0)
})

test("flash", async () => {
  const dt = new DataTransporter(mockSender)
  // データが蓄積されてない送信しない
  await expect(dt.flash()).resolves.toBeUndefined()
  expect(mockSender).toBeCalledTimes(0)
  expect(dt.dataList).toEqual([])
  expect(dt.nextFlashIndex).toEqual(0)

  // データ投入
  dt.push(testData1)
  dt.push(testData2)
  expect(dt.dataList).toEqual([testData1, testData2])
  expect(dt.nextFlashIndex).toEqual(0)

  // データが蓄積された状態でflashすると、全部送信
  await expect(dt.flash()).resolves.toEqual([[testData1, testData2], 0, 1])
  expect(dt.dataList).toEqual([testData1, testData2])
  expect(dt.nextFlashIndex).toEqual(2)
  expect(mockSender).toBeCalledTimes(1)
  expect(mockSender).toBeCalledWith([testData1, testData2], 0, 1)

  // データが蓄積されてない送信しない
  await expect(dt.flash()).resolves.toBeUndefined()
  expect(dt.dataList).toEqual([testData1, testData2])
  expect(dt.nextFlashIndex).toEqual(2)
  expect(mockSender).toBeCalledTimes(1)

  // もう１件データ投入
  dt.push(testData3)
  expect(dt.dataList).toEqual([testData1, testData2, testData3])
  expect(dt.nextFlashIndex).toEqual(2)
  expect(mockSender).toBeCalledTimes(1)

  // flash
  await expect(dt.flash()).resolves.toEqual([[testData3], 2, 2])
  expect(dt.dataList).toEqual([testData1, testData2, testData3])
  expect(dt.nextFlashIndex).toEqual(3)
  expect(mockSender).toBeCalledTimes(2)
  expect(mockSender).toBeCalledWith([testData3], 2, 2)
})

test("start", async () => {
  const dt = new DataTransporter(mockSender)
  // テストデータ投入
  dt.push(testData1)
  dt.push(testData2)
  expect(dt.dataList).toEqual([testData1, testData2])
  expect(dt.nextFlashIndex).toEqual(0)
  expect(mockSender).not.toBeCalled()
  expect(mockSender).toBeCalledTimes(0)

  dt.start()
  expect(dt.dataList).toEqual([testData1, testData2])
  expect(dt.nextFlashIndex).toEqual(0)
  expect(mockSender).not.toBeCalled()
  expect(mockSender).toBeCalledTimes(0)

  jest.runOnlyPendingTimers() // setIntervalを実行することで flashする
  expect(mockSender).toBeCalled()
  expect(mockSender).toBeCalledTimes(1)

  // データが蓄積されてない送信しない
  jest.runOnlyPendingTimers() // setIntervalを実行することで flashする
  expect(dt.dataList).toEqual([testData1, testData2])
  expect(dt.nextFlashIndex).toEqual(2)
  expect(mockSender).toBeCalledTimes(1)

  // もう１件データ投入
  dt.push(testData3)
  expect(dt.dataList).toEqual([testData1, testData2, testData3])
  expect(dt.nextFlashIndex).toEqual(2)
  expect(mockSender).toBeCalledTimes(1)

  jest.runOnlyPendingTimers() // setIntervalを実行することで flashする
  expect(dt.dataList).toEqual([testData1, testData2, testData3])
  expect(dt.nextFlashIndex).toEqual(3)
  expect(mockSender).toBeCalledTimes(2)
  expect(mockSender).toBeCalledWith([testData3], 2, 2)
})

describe("end", () => {
  test("endを呼び出す時は、startしてないとthrow", () => {
    const dt = new DataTransporter(mockSender)
    // テストデータ投入
    dt.push(testData1)
    dt.push(testData2)
    expect(dt.dataList).toEqual([testData1, testData2])
    expect(() => {
      dt.end()
    }).toThrowError("end method should be called after start.")
  })
  test("endを呼び出すと、flashされる", async () => {
    const dt = new DataTransporter(mockSender)
    // テストデータ投入
    dt.push(testData1)
    dt.push(testData2)
    expect(dt.dataList).toEqual([testData1, testData2])
    expect(dt.nextFlashIndex).toEqual(0)
    expect(mockSender).not.toBeCalled()
    expect(mockSender).toBeCalledTimes(0)

    dt.start()
    expect(dt.dataList).toEqual([testData1, testData2])
    expect(dt.nextFlashIndex).toEqual(0)
    expect(mockSender).not.toBeCalled()
    expect(mockSender).toBeCalledTimes(0)

    dt.end()
    expect(mockSender).toBeCalled()
    expect(mockSender).toBeCalledTimes(1)
    expect(mockSender).toBeCalledWith([testData1, testData2], 0, 1)
  })
})
