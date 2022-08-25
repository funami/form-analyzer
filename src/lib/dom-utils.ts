import GaConnect from "./ga_connect"

export type WaitAppearTargetTestCondition = (
  window: Window,
  targetlement: HTMLElement
) => boolean

export type WaitAppearTargetTester = () => void
export type WaitAppearTargetTestrunner = () => void
export abstract class WaitAppearTargetTrigger {
  private testrunner

  public testers: WaitAppearTargetTester[] = []
  constructor() {
    const testrunner = () => {
      this.testers.forEach((tester) => tester())
    }
    this.testrunner = testrunner
    this.connect(this.testrunner)
  }

  release(tester: WaitAppearTargetTester, targetlement: HTMLElement) {
    const index = this.testers.indexOf(tester)
    this.testers.splice(index, 1)

    if (this.testers.length == 0) {
      this.disconnect(this.testrunner)
    }
  }
  connect(testrunner: WaitAppearTargetTestrunner) {}
  disconnect(testrunner: WaitAppearTargetTestrunner) {}
}
export type WaitAppearTargetOption = {
  appearThreshold?: number
  conditions?: WaitAppearTargetTestCondition
  trigger?: WaitAppearTargetTrigger
}
export const waitAppearTarget = (
  window: Window,
  targetlement: HTMLElement,
  option: WaitAppearTargetOption
): Promise<void> => {
  const appearThreshold = option.appearThreshold || 0.4
  const conditions = option.conditions
  const trigger = option.trigger
  const fire = (): boolean => {
    const appeard =
      window.scrollY + window.innerHeight * (1 - appearThreshold) >
      targetlement.offsetTop
    return appeard && (conditions ? conditions(window, targetlement) : true)
  }
  return new Promise((resolve, reject) => {
    if (targetlement == null) {
      reject(new Error(`${targetlement} element not found`))
    } else {
      if (fire()) {
        resolve()
      } else {
        const release = (tester: WaitAppearTargetTester) => {
          trigger?.release(tester, targetlement)
          window.removeEventListener("scroll", tester)
        }
        const tester = () => {
          if (fire()) {
            release(tester)
            resolve()
          }
        }
        if (trigger) trigger.testers.push(tester)
        window.addEventListener("scroll", tester)
      }
    }
  })
}

export const getFieldValue = (
  element: HTMLElement
): { v?: any; c?: boolean; vl?: number } => {
  const nodeName = element.nodeName.toUpperCase()
  const type = element.getAttribute("type")?.toLowerCase() || null
  let ret: { v?: any; c?: boolean; vl?: number } = {}
  if (nodeName == "SELECT") {
    ret = { v: (element as HTMLSelectElement).value }
  } else if (type == "checkbox") {
    const elm = element as HTMLInputElement
    ret = { v: elm.value, c: elm.checked }
  } else {
    ret = { v: (element as HTMLInputElement).value }
    ret.vl = ret.v?.length
  }
  return ret
}
