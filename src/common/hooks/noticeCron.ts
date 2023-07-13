import type { Task } from '@cmn/types'
import { getDateTimeParts } from '@cmn/utils'

type DateType = Omit<Task['cycle'], 'autoDelete'>

export const useDateCompute = (
  parms: DateType,
  minute: number,
  operator: '-' | '+' = '-'
): DateType => {
  const { date, time } = parms
  const dateParse = Date.parse(`${date} ${time}`)
  const m = minute * 60 * 1000
  let resultDate = dateParse - m
  if (operator === '+') {
    resultDate = dateParse + m
  }
  let result: string | string[] = new Date(resultDate).toLocaleString()

  result = result.split(' ') // ['2023/5/20', '19:35:00']
  return {
    type: parms.type,
    otherDate: parms.otherDate,
    date: result[0].replace(/\//g, '-'),
    time: ''.padEnd(5, result[1])
  }
}

const useDateToCron = (parms: DateType) => {
  const { date, time, type: cycle, otherDate } = parms
  const {
    month,
    day: d,
    hour: h,
    minute: m
  } = getDateTimeParts(new Date(`${date} ${time}`))

  let cron = `${m} ${h}`
  switch (cycle) {
    case 'once':
      cron = `1 ${cron} ${d} ${month} *`
      break
    case 'daily':
      cron += ` */1 * *`
      break
    case 'weekly':
      cron += ` * * ${otherDate.map((week) => week.slice(0, 3)).join(',')}`
      break
    case 'monthly':
      cron += ` ${otherDate.join(',')} * *`
      break
    default:
      break
  }
  return cron
}

export const useNoticeCron = (
  parms: DateType,
  minute: number
): Task['notice'] => {
  // 设置通知时间，执行任务前${minute}分钟通知
  const noticeDate = useDateCompute(parms, minute)
  const cron = useDateToCron(noticeDate)
  return {
    cron,
    dateTime: `${noticeDate.date} ${noticeDate.time}`
  }
}
