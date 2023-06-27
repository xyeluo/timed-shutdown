import { defineStore } from 'pinia'
import { useFirstCycle, useFirstType, useCompleteDate } from '@panel/hooks'
import type { Task } from '@cmn/types'
import { cloneStore } from '../utils'
import { usePlansStore } from '@/panel/stores'

export const useTaskStore = defineStore('TaskStore', () => {
  const init = {
    name: '',
    plan: useFirstType(),
    cycle: {
      type: useFirstCycle(),
      date: null,
      time: null,
      otherDate: [],
      autoDelete: true
    }
  }
  const { addPlan, saveTaskDB } = usePlansStore()

  let task = ref<Task>(cloneStore(init))

  // 当任务周期发生改变时清除date
  watch(
    () => task.value.cycle.type,
    () => {
      task.value.cycle.date = null
      task.value.cycle.otherDate = []
    }
  )

  const reset = () => {
    task.value = init
  }

  const createTask = async () => {
    // todo: task有效性验证
    useCompleteDate(task.value)

    const stdout = await preload.createTask(cloneStore(task.value))
    addPlan(task.value)
    saveTaskDB(task.value)
    reset()
    return stdout
  }

  return { task, createTask }
})
