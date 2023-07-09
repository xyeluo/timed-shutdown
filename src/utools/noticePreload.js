const { ipcRenderer } = require('electron')

ipcRenderer.on('notice', (event, taskName) => {
  let timed = false
  const sendNotice = () => {
    if (window.receiveNotice) {
      window.receiveNotice(taskName)
      timed && cancelAnimationFrame(timed)
      return
    }
    timed = requestAnimationFrame(sendNotice)
  }
  sendNotice()
})

window.preload = {
  ...require('./utils/utools')
}
