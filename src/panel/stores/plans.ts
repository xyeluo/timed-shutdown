import type { Task, Plan } from '@/common/types'
import { defineStore } from 'pinia'
import { cloneStore } from '@panel/utils'
import {
  useConvertTaskCycleType,
  useConvertTaskPlan,
  useSetDateTime
} from '@panel/hooks/taskToPlan'

export const usePlansStore = defineStore('PlansStore', () => {
  let plans = ref<Plan[]>([])

  let taskDB: Task[] = []

  // 初始化时加载taskDB，并据此转换成任务列表显示
  preload.dbStorageRead().then((value) => {
    taskDB = value
    taskDB.forEach((task) => {
      addPlan(task)
    })
  })

  const saveTaskDB = (task: Task) => {
    let rawTask = cloneStore(task)
    taskDB.unshift(rawTask)
    preload.dbStorageSave(taskDB)
  }

  const addPlan = (task: Task) => {
    let plan: Plan = {
      name: task.name,
      plan: useConvertTaskPlan(task.plan),
      cycle: {
        type: useConvertTaskCycleType(task.cycle.type),
        autoDelete: task.cycle.autoDelete
      },
      state: true,
      dateTime: useSetDateTime(task.cycle)
    }
    plans.value.unshift(plan)
  }

  preload.dbStorageSave(cloneStore([]))

  return { plans, addPlan, saveTaskDB }
})
