export const openUrl = (url: string) => {
  utools.shellOpenExternal(url)
}

export const getDateTimeParts = (date: Date = new Date()) => {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    seconds: date.getSeconds()
  }
}
/**
 * @returns yyyy-MM-dd
 */
export const getNowDateString = () => {
  const date = new Date()
  let { year, month, day } = getDateTimeParts(date)
  return `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}`
}

export const cloneStore = <T>(parms: T): T => {
  return JSON.parse(JSON.stringify(parms))
}

export const isDarkMode = () => utools.isDarkColors()

let firstEnter = true
export const pluginEnter = (
  callback: (action?: { code: string; type: string; payload: any }) => void
) => {
  if (firstEnter) {
    firstEnter = false
    callback()
  }
  utools.onPluginEnter(callback)
}
