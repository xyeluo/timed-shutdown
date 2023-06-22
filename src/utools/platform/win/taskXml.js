/*
 * @Description: 创建win任务计划程序所需的xml文件
 */
const { writeFile, access, unlink } = require('fs/promises')
const { xmlPath } = require('../../utils/')

function reduceXmlObj(xmlObj, callback, options = {}) {
  const config = {
    titleCase: false,
    initValue: '',
    ...options
  }
  return Object.entries(xmlObj).reduce((str, [key, value]) => {
    if (config.titleCase) {
      key = key.replace(/^\w/g, (k) => k.toUpperCase())
    }
    return callback(str, [key, value])
  }, config.initValue)
}

function objToXml(xmlObj, indent = false) {
  const indentStr = ' '.repeat(indent)
  const callback = (xml, [xmlKey, xmlValue]) => {
    const child = xmlValue?._child
    let text = xmlValue?._text ?? ''

    text = indent !== false ? ' ' + text : text
    text = text.trim().length !== 0 ? `${indentStr}${text}\n` : ''

    Reflect.deleteProperty(xmlValue, '_child')
    Reflect.deleteProperty(xmlValue, '_text')

    // 补充xml标签属性
    xml += `${indentStr}<${xmlKey}${reduceXmlObj(
      xmlValue,
      (attrs, [attrKey, attrValue]) => (attrs += ` ${attrKey}="${attrValue}"`)
    )}>\n`

    if (child !== undefined)
      xml += objToXml(child, indent !== false ? indent + 1 : false)
    if (text) xml += text
    xml += `${indentStr}</${xmlKey}>\n`
    return xml
  }
  return reduceXmlObj(xmlObj, callback, { titleCase: true })
}

/**
 * 把xmlobj完整展开再转换成xml字符串
 * @param {Object} xmlObj
 * @returns Object
 */
function expandXmlObj(xmlObj) {
  const callback = (xmlObjPre, [xmlKey, xmlValue]) => {
    let obj = {}
    obj[xmlKey] = {}

    // value不是对象则作为文本添加到_text
    if (typeof xmlValue !== 'object') {
      obj[xmlKey]._text = xmlValue
    }

    // 是对象则递归
    if (typeof xmlValue === 'object') {
      // 对象中若存在_text直接赋值，然后删除本身
      if (xmlValue._text) {
        obj[xmlKey]._text = xmlValue._text
        Reflect.deleteProperty(xmlValue, '_text')
      }

      // 判断对象中是否存在属性
      reduceXmlObj(xmlValue, (_, [key, value]) => {
        if (key.startsWith('+')) {
          obj[xmlKey][key.slice(1)] = value
          Reflect.deleteProperty(xmlValue, key)
        }
      })

      if (JSON.stringify(xmlValue) !== '{}') {
        obj[xmlKey]._child = expandXmlObj(xmlValue)
      }
    }
    return { ...xmlObjPre, ...obj }
  }
  return reduceXmlObj(xmlObj, callback, { initValue: {} })
}

/**
 * create xml file in xmlPath
 * @param {object} xmlObj similar to 'test' variable in the Test example
 */
async function createTaskXML(xmlObj) {
  const xmlHead = '<?xml version="1.0" encoding="UTF-16"?>'
  const xmlObjPre = {
    Task: {
      version: '1.2',
      xmlns: 'http://schemas.microsoft.com/windows/2004/02/mit/task',
      _child: expandXmlObj(xmlObj)
    }
  }
  const xml = `${xmlHead}\n${objToXml(xmlObjPre, 0)}`
  await writeFile(xmlPath, xml)
}

/**
 * delete xml file
 */
async function deleteTaskXML() {
  await access(xmlPath, 0)
  await unlink(xmlPath)
}

module.exports = {
  createTaskXML,
  deleteTaskXML
}
/**
 * @example
 */
// let befor = {
//  Triggers: {
//   // 存在子标签及文本，则赋值对象，key为标签名，value存子标签，_text存文本
//   CalendarTrigger: {
//    _text: '这是文本1',
//    // 如果标签只存在文本可以直接赋值字符串
//    StartBoundary: '这是文本2',
//    Enabled: true,
//    // 以+号开头的key是xml的属性
//    '+context': 'Author'
// }}}
// let after = expandXmlObj(befor)
// console.log(JSON.stringify(after, null, 2))
// const path = require('path')
// const xmlPath = path.resolve(__dirname, 'timed-shutdonw_UtoolsPlugin.xml')
// createTaskXML(after)
// deleteTaskXML()
