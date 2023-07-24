import { defineStore } from 'pinia'
import {
  useFirstCycle,
  useFirstType,
  useCompleteDate,
  useCompleteName,
  useNoticeCron
} from '@cmn/hooks'
import type { Task } from '@cmn/types'
import { cloneStore } from '@cmn/utils'
import { usePlansStore, useSettingsStore } from '@panel/stores'

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
    },
    skip: false
  }
  const { addPlan, addTaskDB } = usePlansStore()
  const settingsStore = useSettingsStore()

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
    task.value = cloneStore(init)
  }

  const createTask = async (parms?: Task) => {
    let _task = parms ?? task.value

    useCompleteDate(_task)
    useCompleteName(_task)

    const stdout = await preload.createTask(cloneStore(_task))

    _task.notice = useNoticeCron(
      cloneStore(_task.cycle),
      settingsStore.settings.advanceNotice
    )
    addPlan(cloneStore(_task))
    addTaskDB(cloneStore(_task))
    reset()
    return stdout
  }

  return { task, createTask }
})
