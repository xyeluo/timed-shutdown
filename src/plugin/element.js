import Vue from 'vue';
import { Table, TableColumn, Button, Select, Option, Input, TimePicker, Message } from "element-ui";

const coms = [
  Table,
  TableColumn,
  Button,
  Select,
  Option,
  Input,
  TimePicker
];

Vue.prototype.$message = Message;
coms.map((c) => {
  Vue.use(c);
})
