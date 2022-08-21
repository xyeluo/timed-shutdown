const { exec } = require('child_process'),
  iconv = require('iconv-lite'),
  // 设置编码
  encoding = 'gbk',
  binaryEncoding = 'binary',
  // 设置存储id，存储的计划列表只与当前设备相关
  Id = utools.getNativeId() + "TimedPlan";

iconv.skipDecodeWarning = true; //忽略warining

/**
 * @Description: 添加计划任务，执行关机、重启、休眠
 * @param {string} command 用schtasks命令，由用户指定执行任务的时间
 */
function execCmd(command) {
  return new Promise((resolve, reject) => {
    exec(command, { encoding: binaryEncoding }, (error, stdout, stderr) => {
      if (stderr) {
        reject(iconv.decode(stderr, encoding));
        return;
      }
      stdout = stdout == null ? null : iconv.decode(stdout, encoding);
      resolve(stdout);
    })
  })
}

// 数据本地存储
function dbStorageSave(value) {
  utools.dbStorage.setItem(Id, value);
}

// 读取本地数据
function dbStorageRead() {
  const plans = utools.dbStorage.getItem(Id);
  if (plans === null) {
    return [];
  }
  return plans;
}

window.utils = {
  execCmd,
  dbStorageSave,
  dbStorageRead
}