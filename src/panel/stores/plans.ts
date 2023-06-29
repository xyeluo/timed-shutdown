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

  // 初始化时加载taskDB，并据此转换到任务列表(plans)显示
  preload.dbStorageRead().then((value) => {
    taskDB = value
    taskDB.forEach((task) => {
      addPlan(task)
    })
  })

  const saveTaskDB = (task: Task) => {
    let rawTask = cloneStore(task)
    taskDB.push(rawTask)
    preload.dbStorageSave(taskDB)
  }

  const addPlan = (task: Task) => {
    let plan: Plan = {
      ...cloneStore(task),
      plan: useConvertTaskPlan(task.plan),
      cycle: {
        type: useConvertTaskCycleType(task.cycle.type),
        autoDelete: task.cycle.autoDelete
      },
      dateTime: useSetDateTime(task.cycle)
    }
    plans.value.unshift(plan)
  }

  const deletePlan = async (plan: Plan) => {
    const stdout = await preload.deleteTask(plan.name)
    const callback = (p: Plan | Task) => p.name !== plan.name
    plans.value = plans.value.filter(callback)
    taskDB = taskDB.filter(callback)
    preload.dbStorageSave(taskDB)
    return stdout
  }

  const switchState = async (plan: Plan) => {
    const state = !plan.state
    const stdout = await preload.switchState({ name: plan.name, state })
    plan.state = state
    taskDB.some((task) => {
      if (task.name !== plan.name) return false
      task.state = state
      return true
    })
    preload.dbStorageSave(taskDB)
    return stdout
  }
  // preload.dbStorageSave(cloneStore([]))

  return { plans, addPlan, saveTaskDB, deletePlan, switchState }
})
