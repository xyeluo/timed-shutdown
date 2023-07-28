import type {
  CycleKey as _CycleKey,
  PlanKey as _PlanKey,
  otherDateKey as _otherDateKey,
  type PlanOption,
  type CycleOption
} from '@cmn/hooks'
import type { Settings as _Settings } from '@panel/stores'

export type Settings = _Settings
export type PlanKey = _PlanKey
export type CycleKey = _CycleKey
export type otherDateKey = _otherDateKey
export interface Task {
  name: string
  plan: _PlanKey
  cycle: {
    type: _CycleKey
    date: string | null
    time: string | null
    otherDate?: _otherDateKey[] | string[]
    autoDelete?: boolean
    interval?: number
  }
  state: boolean
  notice?: {
    cron: string
    dateTime: string
  }
  skip: boolean
}

export type PlanValue = PlanOption['label']
type CycleTypeValue = CycleOption['label']
export interface Plan extends Omit<Omit<Task, 'plan'>, 'cycle'> {
  plan: PlanValue
  cycle: {
    type: CycleTypeValue
    autoDelete: boolean
  }
  dateTime: string // 执行日期
  nextRun?: string
}
