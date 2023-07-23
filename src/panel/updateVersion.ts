// 对v1版本的用户任务数据升级到v2版本
// todo:下一个大版本应该要移除这个文件
import {
  useNoticeCron,
  type CycleKey,
  type PlanKey,
  type otherDateKey
} from '@cmn/hooks'
import type { Task } from '@cmn/types'
import { cloneStore, getNowDate } from '@cmn/utils'
import type { V1Store } from '@/preload'
import { usePlansStore, useSettingsStore } from '@panel/stores'

type CycleBase = {
  type: CycleKey
  date: string
  time: string
}

function parseTime(dateTime: string) {
  let time: string | string[] = dateTime.replace(/\s/g, ' ').split(' ')
  time = time[time.length - 1]
  if (time === undefined) {
    time = dateTime
  }
  time = time.slice(0, time.length - 1).replace(/时/, ':')
  return time
}

interface OnceCycle extends CycleBase {
  autoDelete: boolean
}
function once(old_task: V1Store): OnceCycle {
  return {
    type: 'once',
    date: old_task.day,
    time: parseTime(old_task.datetime),
    autoDelete: old_task.autoDelete
  }
}

function daily(old_task: V1Store): CycleBase {
  return {
    type: 'daily',
    date: getNowDate(),
    time: parseTime(old_task.datetime)
  }
}

interface WeeklyCycle extends CycleBase {
  otherDate: otherDateKey[]
}
function weekly(old_task: V1Store): WeeklyCycle {
  const week = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ]
  return {
    type: 'weekly',
    date: getNowDate(),
    time: parseTime(old_task.datetime),
    otherDate: old_task.weekly.map((old_w) =>
      week.find((new_w) => new_w.startsWith(old_w))
    ) as otherDateKey[]
  }
}

interface MonthlyCycle extends CycleBase {
  otherDate: string[]
}
function monthly(old_task: V1Store): MonthlyCycle {
  return {
    type: 'monthly',
    date: getNowDate(),
    time: parseTime(old_task.datetime),
    otherDate: old_task.daysOfMonth.map((old_m) => old_m.slice(0, -1))
  }
}

function _updateData(old_store: V1Store[]) {
  const { settings } = useSettingsStore()
  let new_store = old_store.map((old_task) => {
    const types = {
      关机: 'shutdown',
      重启: 'reboot',
      休眠: 'dormancy'
    }

    let newTask: Task = {
      name: old_task.name,
      plan: types[old_task.type] as PlanKey,
      state: old_task.status,
      skip: false,
      cycle: {
        type: 'once',
        date: '',
        time: '',
        otherDate: [],
        autoDelete: true
      }
    }
    switch (old_task.cycle) {
      case '仅一次':
        newTask.cycle = { ...newTask.cycle, ...once(old_task) }
        break
      case '每天':
        newTask.cycle = { ...newTask.cycle, ...daily(old_task) }
        break
      case '每周':
        newTask.cycle = { ...newTask.cycle, ...weekly(old_task) }
        break
      case '每月':
        newTask.cycle = { ...newTask.cycle, ...monthly(old_task) }
        break
      default:
        break
    }

    newTask.notice = useNoticeCron(
      cloneStore(newTask.cycle),
      settings.advanceNotice
    )
    return newTask
  })

  return new_store
}

export default function updateData() {
  const settings = preload.dbStorageRead('settings')
  const old_store = preload.dbStorageRead('v1Store')
  // 满足if条件说明已经完成旧数据迁移或者是新用户则不需要后续的执行
  if (settings !== null || old_store.length === 0) return

  const { addPlan, addTaskDB } = usePlansStore()
  const new_store = _updateData(old_store)

  new_store.forEach((new_t) => {
    addPlan(cloneStore(new_t))
    addTaskDB(cloneStore(new_t))
  })

  preload.removeDBStore('v1Store')
}
