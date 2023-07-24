const { ipcRenderer } = require('electron')
const { waitWindowPrpperty } = require('./utils/common')
const IpcDispatch = require('./utils/ipcDispatch')

let mainId
ipcRenderer.once('init', (event) => {
  mainId = event.senderId
})

ipcRenderer.on('notice', (_, task) => {
  waitWindowPrpperty('receiveNotice', () => window.receiveNotice(task))
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

function closeWindow() {
  ipcRenderer.sendTo(mainId, 'closeWindow')
}

window.noticePreload = {
  createTask,
  stopPlan,
  dbStorageRead: require('./utils/utools').dbStorageRead,
  closeWindow
}
