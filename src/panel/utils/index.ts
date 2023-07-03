export const openUrl = (url: string) => {
  utools.shellOpenExternal(url)
}

export const getNowDate = () => {
  const date = new Date(),
    year = date.getFullYear(),
    month = String(date.getMonth() + 1).padStart(2, '0'),
    strDate = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${strDate}`
}

export const cloneStore = <T>(parms: T): T => {
  return JSON.parse(JSON.stringify(parms))
}
