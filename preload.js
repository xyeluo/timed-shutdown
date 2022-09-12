const { exec } = require('child_process'),
  iconv = require('iconv-lite'),
  fs = require("fs"),
  { resolve } = require("path"),
  // 设置编码
  encoding = 'gbk',
  binaryEncoding = 'binary',
  // 设置存储id，存储的计划列表只与当前设备相关
  Id = utools.getNativeId() + "TimedPlan",
  xmlPath = resolve(utools.getPath('home'), "timed-shutdonw_UtoolsPlugin.xml");

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

function createDaysOfMonth(daysOfMonth) {
  let temp = "<ScheduleByMonth><DaysOfMonth>";
  daysOfMonth.forEach(day => {
    temp += `<Day>${day}</Day>`;
  });
  return temp += "</DaysOfMonth></ScheduleByMonth>";
}
// 创建xml文件用于导入到系统计划任务
function createXML(plan) {
  let daysOfMonth = createDaysOfMonth(plan.daysOfMonth);
  const xmlTemplete = `<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Author>timed-shutdown UtoolsPlugin</Author>
  </RegistrationInfo>
  <Triggers>
    <CalendarTrigger>
      <StartBoundary>${plan.datetime}</StartBoundary>
      <Enabled>true</Enabled>
        ${daysOfMonth}
    </CalendarTrigger>
  </Triggers>
  <Actions Context="Author">
    <Exec>
      <Command>shutdown</Command>
      <Arguments>${plan.argu}</Arguments>
    </Exec>
  </Actions>
</Task>
  `;
  return new Promise((resolve, reject) => {
    fs.writeFile(xmlPath, xmlTemplete.toString(), function (error) {
      if (error) {
        reject(error);
        return;
      }
      resolve(xmlPath);
    })
  })
}

// 删除xml文件
function deleteXML() {
  fs.access(xmlPath, fs.constants.F_OK, (err) => {
    err ? '' : fs.unlink(xmlPath, (err) => { });
  });
}

// 读取本地数据
function dbStorageRead() {
  const plans = utools.dbStorage.getItem(Id);
  if (plans === null) {
    return [];
  }
  return plans;
}

// 插件应用退出的同时退出进程
function exit() {
  utools.onPluginOut(() => {
    deleteXML()
    setTimeout(() => {
      process.exit(0);
    }, 800)
  })
}

window.utils = {
  execCmd,
  dbStorageSave,
  dbStorageRead,
  exit,
  createXML
}
