const { exec } = require('child_process')
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
 * @description 首字母小写
 */
function firstLetterLower(str) {
  return str.replace(/^[A-Z]/, (match) => match.toLowerCase())
}

/**
 * @description 首字母大写
 */
function firstLetterUpper(str) {
  return str.replace(/^[a-z]/, (match) => match.toUpperCase())
}

/**
 * @description 返回变量类型
 * @param {*} params
 * @returns string,array,number,object,function...
 */
function getType(params) {
  let str = Object.prototype.toString.call(params)
  str = firstLetterLower(str.slice(8, -1))
  return str
}

/**
 * @description 等待property挂载到window上后执行callback
 * @param {string} property
 * @param {Function} callback
 */
function waitWindowPrpperty(property, callback) {
  let timed = false
  const wait = async () => {
    if (window.hasOwnProperty(property)) {
      callback()
      timed && cancelAnimationFrame(timed)
      return
    }
    timed = requestAnimationFrame(wait)
  }
  wait()
}
module.exports = {
  execCmd,
  getType,
  firstLetterLower,
  firstLetterUpper,
  waitWindowPrpperty
}
