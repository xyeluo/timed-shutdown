const { PLANS_STORE, SKIP_PLANS_STORE, SETTINGS_STORE } = require('./config')

const dbNameList = {
  plans: PLANS_STORE,
  skipPlans: SKIP_PLANS_STORE,
  settings: SETTINGS_STORE
}

/**
 * 存储计划任务
 * @param {"plans"|"skipPlans"|"settings"} dbName
 * @param {object} data
 */
async function dbStorageSave(dbName, data) {
  await utools.dbStorage.setItem(dbNameList[dbName], data)
}

/**
 * 读取本地数据
 * @param {"plans"|"skipPlans"|"settings"} dbName
 * @returns data
 */
async function dbStorageRead(dbName) {
  const plans = await utools.dbStorage.getItem(dbNameList[dbName])
  if (plans === null) {
    if (dbName === 'settings') return null
    return []
  }
  return plans
}

/**
 * 删除plans和skipPlans中指定数据
 * @param {"plans"|"skipPlans"} dbName
 * @param {string} name
 */
async function deletePlan(dbName, name) {
  let store = await dbStorageRead(dbName)
  store = store.filter((s) => s.name !== name)
  dbStorageSave(dbName, store)
}

module.exports = {
  dbStorageSave,
  dbStorageRead,
  deletePlan
}
