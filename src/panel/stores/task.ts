import { defineStore } from 'pinia'
import {
  useErrorMsg,
  useFirstCycle,
  useFirstType,
  useSuccessMsg,
  useWarningMsg
} from '@panel/hooks'

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
  const createTask = (loading: Ref<boolean>) => {
    loading.value = !loading.value
    useWarningMsg(
      "I don't know why nobody told you how to unfold your love. Once upon a time you dressed so fine. How many roads must a man walk down. 'Cause you walked hand in hand With another man in my place. If I were you, I will realize that I love you more than any other guy."
    )

    setTimeout(() => {
      console.log(task.value)

      loading.value = !loading.value
    }, 1000)
  }
  return { task, createTask }
})
