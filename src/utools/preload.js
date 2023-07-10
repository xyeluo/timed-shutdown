const { ipcRenderer } = require('electron')
const { Cron, scheduledJobs } = require('./lib/croner')
const { timezone } = require('./utils/config')
class ScheNotification {
  static #win
  static #windowId
  constructor() {
    throw new Error('Cannot instantiate this class')
  }
  static async createWindow() {
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

    // win.webContents.openDevTools({ mode: 'detach' })

    ScheNotification.#win = win
    ScheNotification.#windowId = win.webContents.id
  }

  static async #sendNotice(taskName) {
    // 被alt+f4关闭时重新创建窗口
    if (!ScheNotification.#win || ScheNotification.#win.isDestroyed()) {
      await ScheNotification.createWindow()
    }
    ipcRenderer.sendTo(ScheNotification.#windowId, 'notice', taskName)
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
      ScheNotification.#sendNotice(task.name)
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
}

window.preload = {
  ...require('./platform/win'),
  ...require('./utils/utools'),
  addNotice: ScheNotification.addNotice,
  switchNoticeState: ScheNotification.switchNoticeState,
  deleteNotice: ScheNotification.deleteNotice
}
