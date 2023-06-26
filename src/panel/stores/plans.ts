import type { Task } from '@/common/types'
import { defineStore } from 'pinia'
import {
  useCycleWeeklyOptions,
  usePlanOptions,
  useCycleOptions,
  type PlanOption,
  type CycleOption,
  type PlanKey,
  type CycleKey,
  type OtherDateOption
} from '@panel/hooks'
import { cloneStore } from '../utils'

type PlanValue = PlanOption['label']
type CycleTypeValue = CycleOption['label']
type OtherDateValue = OtherDateOption['label']
export interface Plan extends Omit<Omit<Task, 'plan'>, 'cycle'> {
  name: string
  plan: PlanValue
  cycle: {
    type: CycleTypeValue
    autoDelete: boolean
  }
  state: boolean
  dateTime: string // 执行日期
}

export const usePlansStore = defineStore('PlansStore', () => {
  const plans = ref<Plan[]>([])

  const convertTaskPlan = (plan: PlanKey) => {
    const item = usePlanOptions().find((o) => o.value === plan)
    return item!.label
  }

  const convertTaskCycleType = (type: CycleKey) => {
    const item = useCycleOptions().find((o) => o.value === type)
    return item!.label
  }

  const setDateTime = (cycle: Task['cycle']) => {
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
    dateTime += ' ' + cycle.time?.split(':').join('时') + '日'
    return dateTime
  }

  const addPlan = (task: Task) => {
    let plan: Plan = {
      ...cloneStore(task),
      cycle: {
        type: convertTaskCycleType(task.cycle.type)
      },
      plan: convertTaskPlan(task.plan),
      state: true,
      dateTime: setDateTime(task.cycle)
    }
    plans.value.unshift(plan)
  }
  return { plans, addPlan }
})
