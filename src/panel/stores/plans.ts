import type { Task, Plan } from '@cmn/types'
import { defineStore } from 'pinia'
import { cloneStore } from '@cmn/utils'
import {
  useConvertTaskCycleType,
  useConvertTaskPlan,
  useSetDateTime
} from '@cmn/hooks/taskToPlan'

export const usePlansStore = defineStore('PlansStore', () => {
  let plans = ref<Plan[]>([])

  let taskDB: Task[] = []

  // 初始化时加载taskDB，并据此转换到任务列表(plans)显示
  preload.dbStorageRead('plans').then((value) => {
    taskDB = value
    taskDB.forEach((task) => {
      addPlan(task)
    })
  })

  const addTaskDB = (task: Task) => {
    let rawTask = cloneStore(task)
    taskDB.push(rawTask)
    preload.dbStorageSave('plans', taskDB)
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
    preload.addNotice(cloneStore(task))
    plans.value.unshift(plan)
  }

  const deletePlanFromTaskDb = (plan: Plan) => {
    const callback = (p: Plan | Task) => p.name !== plan.name
    preload.deleteNotice(plan.name)
    plans.value = plans.value.filter(callback)
    taskDB = taskDB.filter(callback)
    preload.dbStorageSave('plans', taskDB)
  }

  const deletePlan = async (plan: Plan) => {
    const stdout = await preload.deleteTask(plan.name)
    deletePlanFromTaskDb(plan)
    return stdout
  }

  const switchState = async (plan: Plan | Task) => {
    const state = !plan.state
    const partPlan = { name: plan.name, state }
    const stdout = await preload.switchState(partPlan)
    await preload.switchNoticeState(partPlan)

    plan.state = state

    const callback = (task: Plan | Task) => {
      if (task.name !== plan.name) return false
      task.state = state
      task.skip = plan.skip
      return true
    }

    // 通知视图传递过来的数据不是响应式，需要手动修改plans的state
    if (!isProxy(plan)) {
      plans.value.some(callback)
    }
    taskDB.some(callback)

    preload.dbStorageSave('plans', taskDB)
    return stdout
  }

  const runPlan = async (plan: Plan) => await preload.runPlan(plan.name)

  return {
    plans,
    addPlan,
    addTaskDB,
    deletePlan,
    switchState,
    deletePlanFromTaskDb,
    runPlan
  }
})
