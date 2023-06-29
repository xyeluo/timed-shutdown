const { dbStorageSave, dbStorageRead } = require('./utils/utools')
const {
  createTask,
  deleteTask,
  switchState,
  deleteTaskXML
} = require('./platform/win')
window.preload = {
  createTask,
  deleteTaskXML,
  dbStorageSave,
  dbStorageRead,
  deleteTask,
  switchState
}
