const { dbStorageSave, dbStorageRead } = require('./utils/utools')
const { createTask, deleteTask, deleteTaskXML } = require('./platform/win')
window.preload = {
  createTask,
  deleteTaskXML,
  dbStorageSave,
  dbStorageRead,
  deleteTask
}
