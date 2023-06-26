import { defineStore } from 'pinia'
import { useFirstCycle, useFirstType } from '@panel/hooks'
import type { Task } from '@cmn/types'
import { cloneStore } from '../utils'

export const useTaskStore = defineStore('TaskStore', () => {
  const task = ref<Task>({
    name: '',
    plan: useFirstType(),
    cycle: {
      type: useFirstCycle(),
      date: null,
      time: null,
      otherDate: [],
      autoDelete: true
    }
  })

  // 当任务周期发生改变时清除date
  watch(
    () => task.value.cycle.type,
    () => {
      task.value.cycle.date = null
      task.value.cycle.otherDate = []
    }
  )

  const createTask = async () => {
    return await preload.createTask(cloneStore(task.value))
  }
  return { task, createTask }
})
