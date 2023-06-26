import { defineStore } from 'pinia'
import {
  useErrorMsg,
  useFirstCycle,
  useFirstType,
  useSuccessMsg
} from '@panel/hooks'
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
  const task = ref<Task>(cloneStore(init))

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

  const { addPlan } = usePlansStore()
  const createTask = async () => {
    const stdout = await preload.createTask(cloneStore(task.value))
    addPlan(task.value)
    reset()

    return stdout
  }
  return { task, createTask }
})
