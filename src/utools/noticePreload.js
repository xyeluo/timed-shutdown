const { ipcRenderer } = require('electron')
const { waitWindowPrpperty } = require('./utils/common')

let mainId
ipcRenderer.once('init', (event) => {
  mainId = event.senderId
})

ipcRenderer.on('notice', (_, task) => {
  waitWindowPrpperty('receiveNotice', () => {
    utools.shellBeep()
    window.receiveNotice(task)
  })
})

function createTask(task) {
  ipcRenderer.sendTo(mainId, 'createTask', task)
}

function stopPlan(plan) {
  ipcRenderer.sendTo(mainId, 'stopPlan', plan)
}

window.noticePreload = {
  createTask,
  stopPlan
}
