import { useDateCompute, type DateType } from '@cmn/hooks'
import { getDateTimeParts } from '@cmn/utils'
import { useSettings } from './settings'

export const useCurrentCycle = (cycle: DateType) => {
  const { year, month, day, hour, minute } = getDateTimeParts()
  // 计算出本周期任务执行时间
  const currentCycle = useDateCompute(
    {
      ...cycle,
      date: `${year}-${month}-${day}`,
      time: `${hour}:${minute}`
    },
    useSettings().advanceNotice,
    '+'
  )
  return currentCycle
}

export * from './settings'
