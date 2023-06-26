import type { CycleKey, PlanKey, otherDateKey } from '@panel/hooks'
import { type PlanOption, type CycleOption } from '@panel/hooks'
export interface Task {
  name: string
  plan: PlanKey
  cycle: {
    type: CycleKey
    date: string | null
    time: string | null
    otherDate: otherDateKey[]
    autoDelete: boolean
  }
}

type PlanValue = PlanOption['label']
type CycleTypeValue = CycleOption['label']
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
