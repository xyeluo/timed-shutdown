const { ipcRenderer } = require('electron')

let mainId
ipcRenderer.once('init', (event) => {
  mainId = event.senderId
})

ipcRenderer.on('notice', (_, task) => {
  let timed = false
  const sendNotice = () => {
    if (window.receiveNotice) {
      utools.shellBeep()
      window.receiveNotice(task)
      timed && cancelAnimationFrame(timed)
      return
    }
    timed = requestAnimationFrame(sendNotice)
  }
  sendNotice()
})

function createTask(task) {
  console.log(mainId, task)
  ipcRenderer.sendTo(mainId, 'createTask', task)
}

window.noticePreload = {
  createTask
}
