const { promisify } = require('util')
const { exec } = require('child_process')

const promiseExec = promisify(exec)

const ID = utools.getNativeId() + 'TimedPlan'

/**
 * 添加计划任务，执行关机、重启、休眠
 * @param {string} command 用schtasks命令，由用户指定执行任务的时间
 */
async function execCmd(command) {
  return await promiseExec(command, { encoding: 'binary' })
}

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