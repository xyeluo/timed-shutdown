const { ipcRenderer } = require('electron')
const { Cron, scheduledJobs } = require('./lib/croner')
const { TIMEZONE } = require('./utils/config')
const {
  dbStorageRead,
  dbStorageSave,
  deleteStorePlan
} = require('./utils/utools')
const { waitWindowPrpperty } = require('./utils/common')
const IpcDispatch = require('./utils/ipcDispatch')

class ScheNotification {
  static #win
  static #windowId
  constructor() {
    throw new Error('Cannot instantiate this class')
  }
  static async #createWindow() {
    const { width, height } = utools.getPrimaryDisplay().workArea
    const options = {
      width,
      height,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      backgroundColor: '#0000',
      maximizable: false,
      minimizable: false,
      skipTaskbar: true,
      webPreferences: {
        preload: './noticePreload.js'
      }
    }

    const pathSuffix = '/notice/index.html'
    const noticeHtml = utools.isDev
      ? `../../dist${pathSuffix}`
      : `.${pathSuffix}`
    const win = utools.createBrowserWindow(noticeHtml, options)

    ScheNotification.#win = win
    ScheNotification.#windowId = win.webContents.id

    ipcRenderer.sendTo(ScheNotification.#windowId, 'init', '')
    win.webContents.openDevTools({ mode: 'detach' })
  }

  static async sendmessage(name, msg) {
    ipcRenderer.sendTo(ScheNotification.#windowId, name, msg)
  }

  static async #sendNotice(task) {
    // 被alt+f4关闭时重新创建窗口
    if (!ScheNotification.#win || ScheNotification.#win.isDestroyed()) {
      await ScheNotification.#createWindow()
    }
    ScheNotification.sendmessage('notice', task)
  }

  static async #getJob(name) {
    return scheduledJobs.find((j) => j.name === name)
  }

  static async addNotice(task) {
    let options = {
      name: task.name,
      timezone: TIMEZONE,
      context: task
    }
    if (task.cycle.type === 'once') {
      options.startAt = new Date(task.notice.dateTime)
      options.maxRuns = 1
    }
    const job = Cron(task.notice.cron, options, (_, context) => {
      ScheNotification.#sendNotice(context)
    })
    if (!task.state) {
      job.pause()
    }
    return new Date(job.nextRun()).toLocaleString()
  }

  static async switchNoticeState(partPlan) {
    const job = await ScheNotification.#getJob(partPlan.name)
    if (partPlan.state) {
      job.resume()
    }
    job.pause()
  }

  static async deleteNotice(name) {
    const job = await ScheNotification.#getJob(name)
    job.stop()
  }

  static clearNotices() {
    return new Promise((resolve) => {
      const clearJobs = () => {
        scheduledJobs.forEach((j) => j.stop())
        if (scheduledJobs.length !== 0) clearJobs()
        else resolve(true)
      }
      clearJobs()
    })
  }
}

IpcDispatch.on('createTask', async (task) => await window.createTask(task))

IpcDispatch.on('stopPlan', async (plan) => {
  const result = await window.switchState(plan)
  const options = {
    timezone: TIMEZONE,
    startAt: new Date(plan.notice.dateTime),
    maxRuns: 1,
    context: plan
  }

  Cron(plan.notice.cron, options, async (self, context) => {
    self.stop()

    let skipStore = await dbStorageRead('skipPlans')
    skipStore.push(plan)
    dbStorageSave('skipPlans', skipStore)
    const task = skipStore.find((task) => task.name === context.name)
    // 当skipPlans的数据中存在plan相关才继续往下执行
    if (!task) return
    deleteStorePlan('skipPlans', task.name)

    const plansStore = await dbStorageRead('plans')
    const p = plansStore.find((p) => p.name === context.name)
    // 当plans数据中存在plan任务且该任务skip为true，state为false时才重新启动
    if (!p || !p?.skip || p?.state) return
    p.skip = false
    window.switchState(p)
  })
  return result
})

function noticeError(error) {
  ScheNotification.sendmessage('noticeError', error)
}
// 重新启动插件时对跳过本次任务的处理
async function initEnableSkipPlan() {
  const skipStore = await dbStorageRead('skipPlans')
  let options = {
    timezone: TIMEZONE,
    maxRuns: 1
  }
  skipStore.forEach(async (skipPlan) => {
    const plansStore = await dbStorageRead('plans')
    const p = plansStore.find((p) => p.name === skipPlan.name)
    if (p && p.skip && !p.state) {
      p.skip = false

      // 检测skipPlan是否过期。小于等于当前时间注册Cron无效，则直接切换任务状态;大于当前时间则注册Cron，由设定时间后切换任务状态
      if (new Date(skipPlan.notice.dateTime) <= new Date()) {
        waitWindowPrpperty('switchState', () => window.switchState(p))
        deleteStorePlan('skipPlans', skipPlan.name)
      } else {
        options.startAt = new Date(skipPlan.notice.dateTime)
        options.context = p
        Cron(skipPlan.notice.cron, options, (self, context) => {
          self.stop()
          waitWindowPrpperty('switchState', () => window.switchState(context))
          deleteStorePlan('skipPlans', skipPlan.name)
        })
      }
    } else deleteStorePlan('skipPlans', skipPlan.name)
  })
}
initEnableSkipPlan()

window.preload = {
  ...require('./platform/win'),
  dbStorageRead,
  dbStorageSave,
  addNotice: ScheNotification.addNotice,
  switchNoticeState: ScheNotification.switchNoticeState,
  deleteNotice: ScheNotification.deleteNotice,
  clearNotices: ScheNotification.clearNotices,
  noticeError
}
