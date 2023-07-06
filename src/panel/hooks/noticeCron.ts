import type { Task } from '@/common/types'
import { getDateTimeParts } from '@panel/utils'

type DateType = Omit<Task['cycle'], 'autoDelete'>

const useDateSubtract = (parms: DateType, minute: number): DateType => {
  const { date, time } = parms
  let result: string | string[] = new Date(
    Date.parse(`${date} ${time}`) - minute * 60 * 1000
  ).toLocaleString()

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
    case 'weekly':
      cron += ` * * ${otherDate.map((week) => week.slice(0, 3)).join(',')}`
    case 'monthly':
      cron += ` ${otherDate.join(',')} * *`
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
  const noticeDate = useDateSubtract(parms, minute)
  const cron = useDateToCron(noticeDate)
  return {
    cron,
    dateTime: `${noticeDate.date} ${noticeDate.time}`
  }
}
