import type { Task } from '@cmn/types'
import { getDateTimeParts, getNowDateString } from '@cmn/utils'
import { useWarningMsg } from '@cmn/hooks'
import { usePlansStore } from '@/panel/stores'

// 除周期‘仅一次’外,date仅在点击‘确定’后获取
export const useCompleteDate = (task: Task) => {
  if (task.cycle.type === 'once') return
  task.cycle.date = getNowDateString()
}

export const useCompleteName = (task: Task) => {
  task.name = task.name.trim()

  // 长度为空才生成name
  if (task.name.length !== 0) return
  const { seconds, minute } = getDateTimeParts()
  // 10-1000
  let tempName = Math.floor(Math.random() * (1000 - 10 + 1)) + 10
  task.name = `TS_${tempName}-${seconds}-${minute}`
}

export const useTaskInvalid = (task: Task) => {
  let { date, otherDate, time, type } = task.cycle
  const warning = (msg: string) => {
    useWarningMsg(msg)
    return true
  }

  if (!time) return warning('任务周期缺少"执行时间"！')
  if (type === 'once' && !date) return warning('任务周期缺少"具体日期"！')
  if (type === 'weekly' && otherDate.length === 0)
    return warning('执行周期缺少"星期"！')
  if (type === 'monthly' && otherDate.length === 0)
    return warning('执行周期缺少"日期"！')

  if (!date) date = getNowDateString()
  if (new Date() >= new Date(`${date} ${time}`))
    return warning('任务时间小于当前时间')

  const { plans } = usePlansStore()
  if (plans.find((p) => p.name === task.name))
    return warning(`“${task.name}”任务已存在`)
  return false
}
