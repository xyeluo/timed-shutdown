import { type themeType, changeTheme as _changeTheme } from '@cmn/Page'
import { defineStore } from 'pinia'
import { usePlansStore, useTaskStore } from './index'
import type { Task } from '@cmn/types'
import { useNoticeCron } from '@cmn/hooks'
import { cloneStore } from '@cmn/utils'

export interface Settings {
  currentTheme: themeType
  advanceNotice: number
}

export const useSettingsStore = defineStore('SettingsStore', () => {
  let settings = ref<Partial<Settings>>({})
  const { clearTaskDBCache, getTaskDBStore, setTaskDBStore } = usePlansStore()

  const init = async () => {
    settings.value = await preload.dbStorageRead('settings')
    // 安装插件时初始化设置
    if (settings.value === null) {
      const _settings: Settings = {
        currentTheme: 'auto',
        advanceNotice: 5
      }
      preload.dbStorageSave('settings', _settings)
      settings.value = _settings
    }
    _changeTheme(settings.value.currentTheme as Settings['currentTheme'])
  }

  init()
  // bug:使用watch对部分属性监听无效，可能是改变setting的部分方法是async的原因
  watchEffect(() => {
    if (settings.value.advanceNotice === null) return
    preload.dbStorageSave('settings', cloneStore(settings.value))
  })

  const changeTheme = (currentTheme: themeType) => {
    _changeTheme(currentTheme)

    settings.value.currentTheme = currentTheme
  }

  const setAdvanceNotice = async (minutes: number) => {
    if (minutes === null) return
    settings.value.advanceNotice = minutes

    clearTaskDBCache()
    await preload.clearNotices()

    const taskDBStore = await getTaskDBStore()
    const taskDB = taskDBStore.map((task): Task => {
      let tempTask = {
        ...task,
        notice: useNoticeCron(cloneStore(task.cycle), minutes)
      }
      preload.addNotice(cloneStore(tempTask)).then((nextRunTime) => {
        console.log(nextRunTime)
      })
      return tempTask
    })
    setTaskDBStore(taskDB)
  }

  return { settings, changeTheme, setAdvanceNotice }
})
