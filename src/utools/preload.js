const { dbStorageSave, dbStorageRead } = require('./utils')
const win = require('./platform/win')
window.preload = {
  createTask: win.createTask,
  deleteTaskXML: win.deleteTaskXML,
  dbStorageSave,
  dbStorageRead
}
