<template>
  <div id="plan-panel">
    <div class="item">
      <span class="instruct">任务类型</span>
      <el-select v-model="plan.type" size="small" placeholder="请选择">
        <el-option
          v-for="item in task.types"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        >
        </el-option>
      </el-select>
    </div>
    <div class="item">
      <label class="instruct" for="planName">任务名称</label>
      <el-input
        placeholder="例：每日关机"
        size="small"
        v-model.trim="plan.name"
        clearable
      ></el-input>
    </div>
    <div class="item">
      <span class="instruct">执行周期</span>
      <el-select v-model="plan.cycle" size="small" placeholder="请选择">
        <el-option
          v-for="item in task.cycle"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        >
        </el-option>
      </el-select>
      <div id="planTime">
        <!-- 执行周期为仅一次显示 -->
        <el-date-picker
          v-show="plan.cycle === 'once' ? true : false"
          v-model.trim="plan.day"
          type="date"
          placeholder="具体日期"
          size="small"
          :picker-options="task.start_Date"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
        <!-- 执行周期为每周显示 -->
        <el-select
          v-show="plan.cycle === 'weekly' ? true : false"
          v-model="plan.weekly"
          size="small"
          placeholder="请选择"
        >
          <el-option
            v-for="item in task.weekly"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          >
          </el-option>
        </el-select>
        <el-time-picker
          v-model.trim="plan.datetime"
          placeholder="执行时间"
          size="small"
          format="HH:mm"
          value-format="HH:mm"
        >
        </el-time-picker>
      </div>
    </div>
    <div class="item">
      <el-button type="primary" @click="addRow">创建计划</el-button>
    </div>
  </div>
</template>

<script>
import throotle from "@mix/index.js";
const utils = window.utils;

export default {
  name: "PlanPanel",
  data() {
    return {
      // 任务提供的可选参数
      task: {
        // 类型
        types: [
          { label: "重启", value: "reboot" },
          { label: "关机", value: "shutdown" },
          { label: "休眠", value: "dormancy" },
        ],
        // 周期
        cycle: [
          { label: "仅一次", value: "once" },
          { label: "每天", value: "daily" },
          { label: "每周", value: "weekly" },
        ],
        // 星期数,在beforeMount中渲染
        weekly: [],
        // 可选日期，从系统当前日期开始
        start_Date: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 24 * 3600 * 1000;
          },
        },
      },
      // 初始化计划所需参数
      plan: {
        type: "",
        name: "",
        cycle: "",
        day: "",
        weekly: "",
        datetime: "",
      },
    };
  },
  mixins: [throotle],
  methods: {
    /**
     * @Description: 判断是否是windows系统
     * @return {boolen} true:是 false:不是
     */
    _isWin() {
      const resutl = utools.isWindows();
      if (!resutl) {
        this.$confirm("<p>该插件仅支持<b>Windows</b>系统</p>", "提醒", {
          type: "warning",
          center: true,
          dangerouslyUseHTMLString: true,
          showCancelButton: false,
          closeOnClickModal: false,
        });
      }
      return resutl;
    },
    /**
     * @Description: 检查任务名称和日期是否完整
     * @return {boolen} true:验证通过; false:缺少信息，验证不通过
     */
    _checkPlan() {
      const { name, datetime, cycle, day } = this.plan;
      if (name === "" || name === null) {
        this.msg({ type: "warning", message: "任务名称未填写！" });
        return false;
      }
      if (cycle === "once" && (day === "" || day === null)) {
        this.msg({ type: "warning", message: "执行周期缺少具体日期！" });
        return false;
      }
      if (datetime === "" || datetime === null) {
        this.msg({ type: "warning", message: "执行周期缺少时间！" });
        return false;
      }
      return true;
    },
    /**
     * @Description: 检查任务名称是否重名
     * @return {boolen} true:存在重名; false:没有重名
     */
    _repeatPlan() {
      let temp = false;
      const plans = utils.dbStorageRead(),
        result = plans.find((item) => {
          return item.name === this.plan.name;
        });

      // 查询到同名的任务
      if (result !== undefined) {
        this.msg({
          type: "warning",
          message: `“${result.name}”任务已存在`,
        });
        temp = true;
      }
      return temp;
    },
    /**
     * @Description: 根据任务类型、执行周期，返回对应命令
     */
    _setCmd() {
      // 根据任务类型确定命令执行参数，关机|重启|休眠
      const types = {
          shutdown: "-s -t 00 -f",
          reboot: "-r -t 00 -f",
          dormancy: "-h",
        },
        { type, name, cycle, datetime, day, weekly } = this.plan;

      // 定义基础命令
      let cmd = `schtasks /create /sc ${cycle} /tn "${name}" /tr "shutdown ${types[type]}" /st ${datetime}`;

      // 执行周期若为一次，则补充命令
      switch (cycle) {
        case "once":
          let tempTime = `${day} ${datetime}`;

          // 如果计划时间小于当前时间，则失败
          if (Date.parse(new Date()) >= Date.parse(tempTime)) {
            return;
          }
          cmd += ` /sd ${day.replace(/-/g, "/")}`; //日期修改为yyyy/mm/dd格式
          break;
        case "weekly":
          // schtasks /create /sc weekly /tn "test" /tr "calc.exe" /st "08:30" /d fri
          cmd += ` /d ${weekly}`;
          break;
        default:
          break;
      }
      return cmd;
    },
    // 执行添加计划命令
    _addPlan() {
      const cmd = this._setCmd();
      if (!cmd) {
        return Promise.reject("计划时间小于当前时间！");
      }
      // 执行命令
      return utils
        .execCmd(cmd)
        .then((result) => {
          return Promise.resolve(result);
        })
        .catch((reason) => {
          return Promise.reject(reason);
        });
    },
    // 增加计划列表行数
    addRow() {
      // 不是windows系统、频繁点击创建计划按钮、表单缺少参数、存在同名计划，则return
      if (
        !this._isWin() ||
        !this.throotle() ||
        !this._checkPlan() ||
        this._repeatPlan()
      ) {
        return;
      }
      this._addPlan()
        .then((msg) => {
          this.msg({ message: msg });
          // 数据传递给List，由List添加到dbStroage
          this.$bus.$emit("getPlan", { ...this.plan });
          this.plan.name = "";
          this.plan.datetime = "";
          this.plan.day = "";
        })
        .catch((reason) => {
          this.msg({
            type: "error",
            message: reason,
          });
        });
    },
  },
  beforeMount() {
    this._isWin();
    utools.onPluginEnter(({ code }) => {
      this.plan.type = code;
    });
    this.plan.cycle = this.task.cycle[0].value;
    const weekly = [
      ["日", "sun"],
      ["一", "mon"],
      ["二", "tue"],
      ["三", "wed"],
      ["四", "thu"],
      ["五", "fri"],
      ["六", "sat"],
    ];
    weekly.forEach((item) => {
      this.task.weekly.push({ label: `星期${item[0]}`, value: item[1] });
    });
    this.plan.weekly = this.task.weekly[0].value;
  },
};
</script>

<style scoped>
/* element-ui样式微调 */
.el-select {
  width: 100px;
}
.el-input {
  width: 200px;
}
#planTime:deep() input::selection {
  background-color: #409eff;
  color: #fff;
}
#planTime:deep() > div {
  margin-left: 20px;
}
#planTime:deep() .el-date-editor {
  width: 150px;
}
#planTime:deep() .el-select {
  width: 90px;
}
/* panel样式 */
.flex,
.item,
#plan-panel,
#planTime {
  display: flex;
}
#plan-panel {
  flex-direction: column;
  margin-bottom: var(--panel-between);
}
.item {
  margin: 10px;
}
.item .el-button {
  margin-left: 70px;
}
.instruct {
  margin-right: 5px;
  line-height: 32px;
}
input[type="number"] {
  width: 50px;
}
</style>
