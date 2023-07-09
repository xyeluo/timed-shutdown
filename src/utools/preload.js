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
    const optional = {
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

    const win = utools.createBrowserWindow(
      '../../dist/notice/index.html',
      optional
    )
    win.webContents.openDevTools({ mode: 'detach' })

    ScheNotification.#win = win
    ScheNotification.#windowId = win.webContents.id
  }

  static async sendNotice(taskName) {
    // 被alt+f4关闭时重新创建窗口
    if (!ScheNotification.#win || ScheNotification.#win.isDestroyed()) {
      await ScheNotification.createWindow()
    }
    ipcRenderer.sendTo(ScheNotification.#windowId, 'notice', taskName)
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
      ScheNotification.sendNotice(task.name)
    })
    console.log(new Date(job.nextRun()).toLocaleString())
  }
}

window.preload = {
  ...require('./platform/win'),
  ...require('./utils/utools'),
  addNotice: ScheNotification.addNotice
}
