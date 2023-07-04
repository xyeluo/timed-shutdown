import type { Task } from '@cmn/types'
import {
  useCycleWeeklyOptions,
  usePlanOptions,
  useCycleOptions,
  type PlanKey,
  type CycleKey,
  type OtherDateOption
} from '@panel/hooks'

type OtherDateValue = OtherDateOption['label']

export const useConvertTaskPlan = (plan: PlanKey) => {
  const item = usePlanOptions().find((o) => o.value === plan)
  return item!.label
}

export const useConvertTaskCycleType = (type: CycleKey) => {
  const item = useCycleOptions().find((o) => o.value === type)
  return item!.label
}

export const useSetDateTime = (cycle: Task['cycle']) => {
  let dateTime = ''
  switch (cycle.type) {
    case 'once':
      dateTime = cycle.date as string
      break
    case 'weekly':
      let weekly: OtherDateValue[] = []
      cycle.otherDate.forEach((week) => {
        const options = useCycleWeeklyOptions().find((o) => o.value === week)
        weekly.push(options!.label as OtherDateValue)
      })
      dateTime = weekly.join('，')
      break
    case 'monthly':
      let monthly: string[] = []
      cycle.otherDate.forEach((day) => {
        monthly.push(`${day}日`)
      })
      dateTime = monthly.join('，')
      break
    default:
      break
  }
  dateTime += ' ' + cycle.time?.split(':').join('时') + '分'
  return dateTime
}
