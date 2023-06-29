const TaskXml = require('./taskXml')
const { xmlPath } = require('../../utils/config')
const { execCmd } = require('../../utils/common')

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
      DisallowStartIfOnBatteries: 'false',
      StopIfGoingOnBatteries: 'false',
      ExecutionTimeLimit: 'PT1H',
      WakeToRun: 'true'
    }
  }
  const commonXmlObj = {
    StartBoundary: dateTime,
    Enabled: 'true'
  }
  switch (cycle.type) {
    case 'once':
      xmlObj.Triggers.TimeTrigger = commonXmlObj
      break
    case 'daily':
      xmlObj.Triggers.CalendarTrigger = {
        ...commonXmlObj,
        ScheduleByDay: {
          DaysInterval: '1'
        }
      }
      break
    case 'weekly':
      xmlObj.Triggers.CalendarTrigger = {
        ...commonXmlObj,
        ScheduleByWeek: {
          DaysOfWeek: cycle.otherDate,
          WeeksInterval: '1'
        }
      }
      break
    case 'monthly':
      xmlObj.Triggers.CalendarTrigger = {
        ...commonXmlObj,
        ScheduleByMonth: {
          DaysOfMonth: {
            Day: {
              _repeat: cycle.otherDate
            }
          },
          Months: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
          ]
        }
      }
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
  const cmd = `schtasks /create /tn "${name}" /xml "${xmlPath}"`
  return await execCmd(cmd)
}

async function deleteTask(name) {
  const cmd = `schtasks /delete /tn "${name}" /f`
  return await execCmd(cmd)
}

async function switchState(aboutPlan) {
  const stateCmd = {
    true: '/enable',
    false: '/disable'
  }
  const cmd = `schtasks /change /tn "${aboutPlan.name}" ${
    stateCmd[aboutPlan.state]
  }`
  return await execCmd(cmd)
}
module.exports = {
  createTask,
  deleteTask,
  switchState,
  deleteTaskXML: TaskXml.deleteTaskXML
}
