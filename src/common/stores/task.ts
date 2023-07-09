import { defineStore } from 'pinia'
import {
  useFirstCycle,
  useFirstType,
  useCompleteDate,
  useCompleteName,
  useNoticeCron
} from '@panel/hooks'
import type { Task } from '@cmn/types'
import { cloneStore } from '@panel/utils'
import { usePlansStore } from '@cmn/stores'

export const useTaskStore = defineStore('TaskStore', () => {
  const init: Task = {
    name: '',
    plan: useFirstType(),
    cycle: {
      type: useFirstCycle(),
      date: null,
      time: null,
      otherDate: [],
      autoDelete: true
    },
    state: true,
    notice: {
      cron: '',
      dateTime: ''
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
    useCompleteDate(task.value)
    useCompleteName(task.value)

    const stdout = await preload.createTask(cloneStore(task.value))
    addPlan(task.value)

    task.value.notice = useNoticeCron(task.value.cycle, 5)
    await preload.addNotice(cloneStore(task.value))

    saveTaskDB(task.value)
    reset()
    return stdout
  }

  return { task, createTask }
})
