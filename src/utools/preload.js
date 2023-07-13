const { ipcRenderer } = require('electron')
const { Cron, scheduledJobs } = require('./lib/croner')
const { timezone } = require('./utils/config')
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
    // dev
    const noticeHtml = '../../dist/notice/index.html'
    // const noticeHtml='./notice/index.html'
    const win = utools.createBrowserWindow(noticeHtml, options)

    ScheNotification.#win = win
    ScheNotification.#windowId = win.webContents.id

    ipcRenderer.sendTo(ScheNotification.#windowId, 'init', '')
    win.webContents.openDevTools({ mode: 'detach' })
  }

  static async #sendNotice(task) {
    // 被alt+f4关闭时重新创建窗口
    if (!ScheNotification.#win || ScheNotification.#win.isDestroyed()) {
      await ScheNotification.#createWindow()
    }
    ipcRenderer.sendTo(ScheNotification.#windowId, 'notice', task)
  }

  static async #getJob(name) {
    return scheduledJobs.find((j) => j.name === name)
  }

  static async addNotice(task) {
    let options = {
      name: task.name,
      timezone
    }
    if (task.cycle.type === 'once') {
      options.startAt = new Date(task.notice.dateTime)
    }
    const job = Cron(task.notice.cron, options, () => {
      ScheNotification.#sendNotice(task)
    })
    console.log(new Date(job.nextRun()).toLocaleString())
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
  static async clearJobs() {
    scheduledJobs.forEach((j) => {
      j.stop()
    })
    console.log(scheduledJobs)
  }
}

ipcRenderer.on('createTask', (_, task) => {
  window.createTask(task)
})

/**
 * @example
 */
// let cron = '30 32 21 */1 * *'
// let task = {
// name: 'TS_1718-2023-07-13',
// plan: 'dormancy',
// cycle: {
//   autoDelete: true,
//   date: '2023-07-13',
//   otherDate: [],
//   type: 'daily',
//   time: '17:18'
// },
// state: true,
// notice: { cron, dateTime: '2023-7-13 17:16' }
// }
// ScheNotification.addNotice(task)

window.preload = {
  ...require('./platform/win'),
  ...require('./utils/utools'),
  addNotice: ScheNotification.addNotice,
  switchNoticeState: ScheNotification.switchNoticeState,
  deleteNotice: ScheNotification.deleteNotice,
  clearJobs: ScheNotification.clearJobs
}
