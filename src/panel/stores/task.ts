import { defineStore } from 'pinia'
import { useFirstCycle, useFirstType } from '@panel/hooks'

export const useTaskStore = defineStore('task', () => {
  const task = ref({
    name: '',
    type: useFirstType(),
    cycle: {
      type: useFirstCycle(),
      date: null,
      time: null
    }
  })

  // 当任务周期发生改变时清除date
  watch(
    () => task.value.cycle.type,
    () => {
      task.value.cycle.date = null
    }
  )
  const addTask = () => {
    console.log(task.value)
  }
  return { task, addTask }
})
