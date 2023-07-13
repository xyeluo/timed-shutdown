import type { Task } from '@cmn/types'
import { getNowDate } from '@cmn/utils'
import { useWarningMsg } from '@cmn/hooks'

// 除周期‘仅一次’外,date仅在点击‘确定’后获取
export const useCompleteDate = (task: Task) => {
  if (task.cycle.type === 'once') return
  task.cycle.date = getNowDate()
}

export const useCompleteName = (task: Task) => {
  task.name = task.name.trim()
  if (task.name.length !== 0) return
  let tempName = task.cycle.time?.split(':').join('')
  task.name = `TS_${tempName}-${task.cycle.date}`
}

export const useTaskInvalid = (task: Task) => {
  const { date, otherDate, time, type } = task.cycle
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
  return false
}
