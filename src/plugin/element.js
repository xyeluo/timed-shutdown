import Vue from 'vue';
import { Table, TableColumn, Button, Select, Option, Input, TimePicker, DatePicker, MessageBox, Message } from "element-ui";

const coms = [
  Table,
  TableColumn,
  Button,
  Select,
  Option,
  Input,
  TimePicker,
  DatePicker
];

Vue.prototype.msg = function msg(parms) {
  const time = {
    success: 3000,
    error: 10000,
    warning: 5000,
  },
    type = parms.type ?? "success",
    duration = time[type]
  Message({
    showClose: true,
    dangerouslyUseHTMLString: true,
    type: type,
    duration: duration,
    message: `<p class="msg">${parms.message}</p>`
  })
};
Vue.prototype.$confirm = MessageBox.confirm;
coms.map((c) => {
  Vue.use(c);
})
