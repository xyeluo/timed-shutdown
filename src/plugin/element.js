import Vue from 'vue';
import { Table, TableColumn, Button, Select, Option, Input, TimePicker, DatePicker, Switch, MessageBox, Message } from "element-ui";

const coms = [
  Table,
  TableColumn,
  Button,
  Select,
  Option,
  Input,
  Switch,
  TimePicker,
  DatePicker
];

Vue.prototype.$message = function msg(option) {
  const time = {
    success: 3000,
    error: 10000,
    warning: 5000,
  },
    type = option.type ?? "success",
    duration = time[type]
  Message({
    showClose: true,
    dangerouslyUseHTMLString: true,
    type: type,
    duration: duration,
    message: `<p class="msg">${option.message}</p>`
  })
};
Vue.prototype.$confirm = function confirm(option) {
  const { msg, title } = option;
  delete option.msg;
  delete option.title;
  return new Promise((resolve, reject) => {
    MessageBox.confirm(msg, title, {
      ...option,
      type: "warning",
      dangerouslyUseHTMLString: true
    }).then(() => {
      resolve();
    }).catch(() => { })
  })
}
coms.map((c) => {
  Vue.use(c);
})
