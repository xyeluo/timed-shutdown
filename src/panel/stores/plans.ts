import type { Task, Plan } from '@/common/types'
import { defineStore } from 'pinia'
import { cloneStore } from '@panel/utils'
import {
  useConvertTaskCycleType,
  useConvertTaskPlan,
  useSetDateTime
} from '@panel/hooks/taskToPlan'

export const usePlansStore = defineStore('PlansStore', () => {
  const plans = ref<Plan[]>([])

  // 加载数据
  preload.dbStorageRead().then((data) => {
    plans.value = data
  })
  const addPlan = (task: Task) => {
    let plan: Plan = {
      ...cloneStore(task),
      cycle: {
        type: useConvertTaskCycleType(task.cycle.type)
      },
      plan: useConvertTaskPlan(task.plan),
      state: true,
      dateTime: useSetDateTime(task.cycle)
    }
    plans.value.unshift(plan)
  }

  watch(plans, (nValue) => {
    preload.dbStorageSave(cloneStore(nValue))
  })
  return { plans, addPlan }
})
