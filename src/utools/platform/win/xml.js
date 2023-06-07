const { writeFile, access, unlink } = require('fs/promises')

const { xmlPath } = require('../../utils/config')

function eachXmlObj(xmlObj, callback) {
  return Object.entries(xmlObj).reduce((str, [key, value]) => {
    return callback(str, [key, value])
  }, '')
}

function objToXml(xmlObj, indent = false) {
  const indentStr = ' '.repeat(indent)

  return eachXmlObj(xmlObj, (xml, [xmlKey, xmlValue]) => {
    const child = xmlValue?._child
    let content = xmlValue?._ctn ?? ''

    content = indent !== false ? ' ' + content : content
    content = content.length !== 0 ? `${indentStr}${content}\n` : ''

    Reflect.deleteProperty(xmlValue, '_child')
    Reflect.deleteProperty(xmlValue, '_ctn')

    // 补充xml标签属性
    xml += `${indentStr}<${xmlKey}${eachXmlObj(
      xmlValue,
      (attrs, [attrKey, attrValue]) => (attrs += ` ${attrKey}="${attrValue}"`)
    )}>\n`

    if (child !== undefined)
      xml += objToXml(child, indent !== false ? indent + 1 : false)
    else xml += content

    xml += `${indentStr}</${xmlKey}>\n`
    return xml
  })
}

/**
 * create xml file in xmlPath
 * @param {object} xmlObj similar to 'test' variable in the Test example
 */
async function createXML(xmlObj) {
  const xml = `<?xml version="1.0" encoding="UTF-16"?>\n${objToXml(xmlObj, 0)}`
  await writeFile(xmlPath, xml)
}

/**
 * delete xml file
 */
async function deleteXML() {
  await access(xmlPath, 0)
  await unlink(xmlPath)
}

module.exports = {
  createXML,
  deleteXML
}

/* Test examples: */
// const xmlPath = resolve(__dirname, 'timed-shutdonw_UtoolsPlugin.xml')
// const test = {Actions: {Context: 'Author',id: 'test',_child: {  Exec: {    _child: { Command: { _ctn: '212' }, Arguments: { _ctn: '2121' } }  }}}}
// console.log(objToXml(test, 3))
// createXML(test)
// deleteXML()
