const { ipcRenderer } = require('electron')
const { waitWindowPrpperty } = require('./utils/common')
const IpcDispatch = require('./utils/ipcDispatch')
const { dbStorageRead } = require('./utils/utools')
let mainId
ipcRenderer.once('init', (event) => {
  mainId = event.senderId
})

ipcRenderer.on('notice', (_, task) => {
  const settings = dbStorageRead('settings')
  waitWindowPrpperty('receiveNotice', () => {
    settings.tipSound && utools.shellBeep()
    window.receiveNotice(task)
  })
})

ipcRenderer.on('noticeError', (_, error) => {
  waitWindowPrpperty('noticeError', () => window.noticeError(error))
})

async function createTask(task) {
  return IpcDispatch.sendTo(mainId, 'createTask', task)
}

async function stopPlan(plan) {
  return IpcDispatch.sendTo(mainId, 'stopPlan', plan)
}

window.noticePreload = {
  createTask,
  stopPlan
}
