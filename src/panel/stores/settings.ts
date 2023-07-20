import { type themeType, changeTheme as _changeTheme } from '@cmn/Page'
import { defineStore } from 'pinia'
import { usePlansStore, useTaskStore } from './index'
import type { Task } from '@cmn/types'
import { useNoticeCron } from '@cmn/hooks'
import { cloneStore } from '@cmn/utils'

export interface Settings {
  currentTheme: themeType
  advanceNotice: number
  tipSound: boolean
}

export const useSettingsStore = defineStore('SettingsStore', () => {
  let settings = ref<Settings>(preload.dbStorageRead('settings'))
  const { clearTaskDBCache, setTaskDBStore } = usePlansStore()

  // bug:使用watch对部分属性监听无效，可能是改变setting的部分方法是async的原因？
  watchEffect(() => {
    // 清空时间输入框也会触发watch，此时值为null，因此没必要存储
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

    const taskDBStore = preload.dbStorageRead('plans')
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

  const tipSoundSwitch = async (flag: boolean) => {
    settings.value.tipSound = flag
  }

  // 安装插件时初始化设置
  if (settings.value === null || Object.keys(settings.value).length === 0) {
    settings.value = {
      currentTheme: 'auto',
      advanceNotice: 5,
      tipSound: true
    }
  }
  changeTheme(settings.value.currentTheme)

  return { settings, changeTheme, setAdvanceNotice, tipSoundSwitch }
})
