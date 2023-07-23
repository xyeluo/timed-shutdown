const {
  PLANS_STORE,
  SKIP_PLANS_STORE,
  SETTINGS_STORE,
  V1_STORE
} = require('./config')

const dbNameList = {
  plans: PLANS_STORE,
  skipPlans: SKIP_PLANS_STORE,
  settings: SETTINGS_STORE,
  v1Store: V1_STORE
}

/**
 * 存储计划任务
 * @param {"plans"|"skipPlans"|"settings"} dbName
 * @param {object} data
 */
async function dbStorageSave(dbName, data) {
  utools.dbStorage.setItem(dbNameList[dbName], data)
}

/**
 * 读取本地数据
 * @param {"plans"|"skipPlans"|"settings"|"v1Store"} dbName
 * @returns data
 */
function dbStorageRead(dbName) {
  const store = utools.dbStorage.getItem(dbNameList[dbName])
  if (store === null) {
    if (dbName === 'settings') return null
    return []
  }
  return store
}

/**
 * 删除plans和skipPlans中指定数据
 * @param {"plans"|"skipPlans"} dbName
 * @param {string} name
 */
async function deleteStorePlan(dbName, name) {
  let store = dbStorageRead(dbName)
  store = store.filter((s) => s.name !== name)
  dbStorageSave(dbName, store)
}

/**
 * 删除键值对(删除文档)
 * @param {"v1Store"} dbName
 */
async function removeDBStore(dbName) {
  utools.dbStorage.removeItem(dbNameList[dbName])
}

module.exports = {
  dbStorageSave,
  dbStorageRead,
  deleteStorePlan,
  removeDBStore
}
