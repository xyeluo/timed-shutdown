const { resolve } = require('path')

module.exports = {
  ID: utools.getNativeId() + '_V2',
  xmlPath: resolve(utools.getPath('temp'), 'timed-shutdonw_UtoolsPlugin.xml')
}
