import type { CycleKey, PlanKey, otherDateKey } from '@panel/hooks'
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
