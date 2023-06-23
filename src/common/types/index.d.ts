import type { CycleValue, PlanValue } from '@panel/hooks'
export interface Task {
  name: string
  plan: PlanValue
  cycle: {
    type: CycleValue
    date: string | null
    time: string | null
    otherDate: string[]
    autoDelete: boolean
  }
}
