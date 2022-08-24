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

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
coms.map((c) => {
  Vue.use(c);
})
