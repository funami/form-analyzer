import {
  FormMeasure,
  WaitAppearTargetTrigger,
  WaitAppearTargetTestrunner,
} from "./index"

const httpSenderOption = {
  url: process.env.API_URL || "http://localhost:8080/fmet",
  api_key: process.env.API_KEY,
}
//console.debug({ httpSenderOption })
if (window.location.href.match(/localhost:8000\/demo/)) {
  const fm = new FormMeasure({
    window,
    httpSenderOption,
  })
  window.fm = fm
  fm.start()
} else if (window.location.href.match(/detail_/)) {
  class MyWaitAppearTargetTrigger extends WaitAppearTargetTrigger {
    connect(testrunner: WaitAppearTargetTestrunner): void {
      document
        .querySelector("#form-with")
        ?.addEventListener("click", testrunner)
    }
    disconnect(testrunner: WaitAppearTargetTestrunner): void {
      document
        .querySelector("#form-with")
        ?.removeEventListener("click", testrunner)
    }
  }
  const fm = new FormMeasure({
    window,
    httpSenderOption,
    waitAppearTargetOption: {
      conditions: (_window: Window, targetlement: HTMLElement) => {
        const formClassList = Array.from(
          targetlement.parentElement?.classList || []
        )
        return formClassList.includes("active")
      },
      trigger: new MyWaitAppearTargetTrigger(),
    },
  })
  window.fm = fm
  fm.start()
}
