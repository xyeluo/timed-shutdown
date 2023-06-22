const { exec } = require('child_process')
const { ID } = require('./config')

const decoder = new TextDecoder('gbk')

/**
 * 添加计划任务，执行关机、重启、休眠
 * @param {string} command 用schtasks命令，由用户指定执行任务的时间
 */
function execCmd(command) {
  return new Promise((resolve, reject) => {
    exec(command, { encoding: null }, (_, stdout, stderr) => {
      if (stderr.byteLength !== 0) {
        reject(decoder.decode(stderr))
        return
      }
      resolve(decoder.decode(stdout))
    })
  })
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
