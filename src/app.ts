import { FormMeasure } from "./index"
const senderUrl = "http://localhost:8000/fm/form_measure_post"

const fm = new FormMeasure({ window, senderUrl })
fm.start()
