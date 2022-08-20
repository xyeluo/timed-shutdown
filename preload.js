const { exec } = require('child_process'),
  iconv = require('iconv-lite'),
  // 设置编码
  encoding = 'gbk',
  binaryEncoding = 'binary',
  // 设置存储id，存储的计划列表只与当前设备相关
  Id = utools.getNativeId() + "TimedPlan";

iconv.skipDecodeWarning = true; //忽略warining

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

function dbStorageSave(value) {
  utools.dbStorage.setItem(Id, value);
}

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