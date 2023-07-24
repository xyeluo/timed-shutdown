const { resolve } = require('path')

const VERSION_HEAD = 'V2'

const NATIVE_ID = utools.getNativeId()

const V1_STORE = `${NATIVE_ID}TimedPlan`

// 所有的任务数据存储位置
const PLANS_STORE = `${NATIVE_ID}_${VERSION_HEAD}`

// 暂停本次执行的任务存储位置
const SKIP_PLANS_STORE = `${NATIVE_ID}_SKIP_PLANS_${VERSION_HEAD}`

// 设置
const SETTINGS_STORE = `SETTINGS_${VERSION_HEAD}`

const XML_PATH = resolve(
  utools.getPath('temp'),
  'timed-shutdonw_UtoolsPlugin.xml'
)
const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

module.exports = {
  PLANS_STORE,
  XML_PATH,
  TIMEZONE,
  SKIP_PLANS_STORE,
  SETTINGS_STORE,
  V1_STORE
}
