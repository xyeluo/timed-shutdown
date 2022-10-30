import Vue from 'vue'
import { Table, TableColumn, Button, Select, Option, Input, TimePicker, DatePicker, Switch, MessageBox, Checkbox, CheckboxGroup, Message, Alert, Tooltip } from 'element-ui'

const coms = [Table, TableColumn, Button, Select, Option, Input, Switch, TimePicker, DatePicker, Checkbox, CheckboxGroup, Alert, Tooltip]

Vue.prototype.$message = function msg(option) {
  const time = {
      success: 3000,
      error: 10000,
      warning: 5000,
    },
    type = option.type ?? 'success',
    duration = time[type]
  Message({
    showClose: true,
    dangerouslyUseHTMLString: true,
    type: type,
    duration: duration,
    message: `<p class="msg">${option.message}</p>`,
  })
}
Vue.prototype.$confirm = function confirm(option) {
  const { msg, title } = option
  // Reflect.deleteProperty(option, 'msg')
  // Reflect.deleteProperty(option, 'title')
  let tempOptin = { ...option }
  tempOptin.type = option.type ?? 'warning'
  return new Promise((resolve) => {
    MessageBox.confirm(msg, title, {
      dangerouslyUseHTMLString: true,
      ...tempOptin,
    })
      .then(() => {
        resolve()
      })
      .catch(() => {})
  })
}
coms.forEach((c) => {
  Vue.use(c)
})
