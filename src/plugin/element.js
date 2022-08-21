import Vue from 'vue';
import { Table, TableColumn, Button, Select, Option, Input, TimePicker, DatePicker, Message } from "element-ui";

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
coms.map((c) => {
  Vue.use(c);
})
