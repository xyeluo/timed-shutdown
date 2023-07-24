const { ipcRenderer } = require('electron')

class IpcDispatch {
  constructor() {
    throw new Error('Cannot instantiate this class')
  }

  static async on(name, fn) {
    ipcRenderer.on(`send::${name}`, async (event, parms) => {
      let result = await fn.apply(this, parms)
      if (!result) return
      event.sender.sendTo(event.senderId, `receive::${name}`, result)
    })
  }

  static sendTo(windowId, name, ...args) {
    return new Promise((resolve, reject) => {
      try {
        ipcRenderer.sendTo(windowId, `send::${name}`, args)
        ipcRenderer.on(`receive::${name}`, (_, parms) => {
          resolve(parms)
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = IpcDispatch
