export const waitAppearTarget = (
  window: Window,
  selector: string,
  appearThreshold = 0.4
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const targetlement = window.document.querySelector(selector) as HTMLElement
    if (targetlement == null) {
      reject(new Error(`${targetlement} element not found`))
    } else {
      const scrollWatcher = () => {
        if (
          window.scrollY + window.innerHeight * (1 - appearThreshold) >
          targetlement.offsetTop
        ) {
          resolve()
        }
      }
      window.addEventListener("scroll", scrollWatcher)
    }
  })
}

export const getElementValue = (
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
