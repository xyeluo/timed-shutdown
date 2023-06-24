const { dbStorageSave, dbStorageRead } = require('./utils/utools')
const { createTask, deleteTaskXML } = require('./platform/win')
window.preload = {
  createTask,
  deleteTaskXML,
  dbStorageSave,
  dbStorageRead
}
