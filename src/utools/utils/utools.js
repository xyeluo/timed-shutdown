const { ID } = require('./config')

/**
 * 存储计划任务
 * @param {object} data
 */
async function dbStorageSave(data) {
  await utools.dbStorage.setItem(ID, data)
}

/**
 * 读取本地数据
 * @returns data
 */
async function dbStorageRead() {
  const plans = await utools.dbStorage.getItem(ID)
  if (plans === null) {
    return []
  }
  return plans
}

module.exports = {
  execCmd,
  dbStorageSave,
  dbStorageRead
}
