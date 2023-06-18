import { defineStore } from 'pinia'
import {
  useErrorMsg,
  useFirstCycle,
  useFirstType,
  useSuccessMsg,
  useWarningMsg
} from '@panel/hooks'
import type { Task } from '@cmn/types'

export const useTaskStore = defineStore('TaskStore', () => {
  const task = ref<Task>({
    name: '',
    plan: useFirstType(),
    cycle: {
      type: useFirstCycle(),
      date: null,
      time: null,
      autoDelete: true
    }
  })

  // 当任务周期发生改变时清除date
  watch(
    () => task.value.cycle.type,
    () => {
      task.value.cycle.date = null
    }
  )
  const createTask = (loading: Ref<boolean>) => {
    loading.value = !loading.value

    setTimeout(() => {
      useSuccessMsg('ok')
      preload.createTask(toRaw(task.value))

      loading.value = !loading.value
    }, 1000)
  }
  return { task, createTask }
})
