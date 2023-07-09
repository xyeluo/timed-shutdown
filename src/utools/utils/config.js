const { resolve } = require('path')

const ID = utools.getNativeId() + '_V2'
const xmlPath = resolve(
  utools.getPath('temp'),
  'timed-shutdonw_UtoolsPlugin.xml'
)
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

module.exports = {
  ID,
  xmlPath,
  timezone
}
