const { dbStorageSave, dbStorageRead } = require('./utils/utools')
const {
  createTask,
  deleteTask,
  switchState,
  deleteTaskXML,
  runPlan
} = require('./platform/win')

window.preload = {
  createTask,
  deleteTaskXML,
  dbStorageSave,
  dbStorageRead,
  deleteTask,
  switchState,
  runPlan
}
