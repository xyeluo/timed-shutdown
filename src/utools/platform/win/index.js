const TaskXml = require('./taskXml')
const utils = require('../../utils')

function getXmlObj(cycle) {
  const dateTime = `${cycle.date}T${cycle.time}:00`
  let xmlObj = {
    RegistrationInfo: {
      Description: 'Created by the utools power task plugin'
    },
    Triggers: {},
    Actions: {
      '+Context': 'Author',
      Exec: {
        Command: 'shutdown',
        Arguments: cycle.execCmd
      }
    },
    Settings: {
      DisallowStartIfOnBatteries: false,
      StopIfGoingOnBatteries: false,
      ExecutionTimeLimit: 'PT1H',
      WakeToRun: true
    }
  }
  switch (cycle.type) {
    case 'once':
      xmlObj.Triggers.TimeTrigger = {
        StartBoundary: dateTime,
        Enabled: true
      }
      break
    case 'daily':
      break
    case 'weekly':
      break
    case 'monthly':
      break
    default:
      break
  }
  return xmlObj
}

async function createTask(task) {
  const { name, cycle, plan } = task
  const planCmd = {
    shutdown: '-s -t 00 -f',
    reboot: '-r -t 00 -f',
    dormancy: '-h'
  }
  cycle.execCmd = planCmd[plan]

  const xmlObj = getXmlObj(cycle)
  await TaskXml.createTaskXML(xmlObj)

  // 导入创建好的xml文件
  const cmd = `schtasks /create /tn "${name}" /xml "${utils.xmlPath}"`
  return await utils.execCmd(cmd)
}
module.exports = {
  createTask,
  deleteTaskXML: TaskXml.deleteTaskXML
}
