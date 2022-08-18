const { exec } = require('child_process'),
  iconv = require('iconv-lite'),
  // 设置编码
  encoding = 'gbk',
  binaryEncoding = 'binary';

iconv.skipDecodeWarning = true; //忽略warining

window.execCmd = function (command, callback) {
  exec(command, { encoding: binaryEncoding }, (error, stdout, stderr) => {
    if (stderr) {
      callback(iconv.decode(stderr, encoding));
      return;
    }
    stdout = stdout == null ? null : iconv.decode(stdout, encoding);
    callback(stdout);
  })
}

