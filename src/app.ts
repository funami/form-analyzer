import FormMeasure from "./lib/form_measure"
const senderUrl = "https://form-measure-stlip2luqa-uc.a.run.app/"
if (window.location.pathname.match(/demo/)) {
  const fm = new FormMeasure({ window, senderUrl })
  fm.start()
}
