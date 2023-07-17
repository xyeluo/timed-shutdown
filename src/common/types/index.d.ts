import type { CycleKey, PlanKey, otherDateKey } from '@cmn/hooks'
import { type PlanOption, type CycleOption } from '@cmn/hooks'
import type { Settings as _Settings } from '@panel/stores'

export type Settings = _Settings
export interface Task {
  name: string
  plan: PlanKey
  cycle: {
    type: CycleKey
    date: string | null
    time: string | null
    otherDate: otherDateKey[] | string[]
    autoDelete: boolean
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
}
