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
        v-model="plan.name"
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
        <!-- <el-date-picker
          v-model="plan.datetime"
          type="datetime"
          placeholder="选择日期时间"
          size="small"
          :picker-options="task.start_Date"
          format="MM-dd HH:mm"
          value-format="MM-dd HH:mm"
        >
        </el-date-picker> -->
        <el-time-picker
          placeholder="执行时间"
          size="small"
          v-model="plan.datetime"
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
export default {
  name: "PlanPanel",
  data() {
    return {
      task: {
        // 类型
        types: [
          { label: "重启", value: "reboot" },
          { label: "关机", value: "shutdown" },
          { label: "休眠", value: "dormancy" },
        ],
        // 周期
        cycle: [{ label: "每天", value: "daily" }],
        // 可选时间
        /* start_Date: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 24 * 3600 * 1000;
          },
        }, */
      },
      // 初始化计划所需参数
      plan: {
        type: "",
        name: "",
        cycle: "",
        datetime: "",
      },
    };
  },
  methods: {
    /**
     * @Description: 验证任务名称和日期是否完整
     * @return {boolen} true:验证通过;false:缺少信息，验证不通过
     */
    _checkPlan() {
      const { name, datetime } = this.plan,
        warning = {
          showClose: true,
          type: "warning",
          duration: 5000,
        };
      let temp = true;
      if (name === "") {
        temp = false;
        setTimeout(() => {
          this.$message({ ...warning, message: "任务名称未填写" });
        }, 0);
      }
      if (datetime === "") {
        temp = false;
        this.$message({ ...warning, message: "执行周期缺少参数" });
      }
      return temp;
    },
    _isRepeatPlan() {},
    // 执行添加计划命令
    _addPlan() {
      // 确定命令执行参数，关机|重启|休眠
      const types = {
          shutdown: "-s -t 00",
          reboot: "-r -t 00",
          dormancy: "-h",
        },
        { type, name, cycle, datetime } = this.plan,
        // 定义命令
        cmd = `schtasks /create /sc ${cycle} /tn "${name}" /tr "shutdown ${types[type]}" /st ${datetime}`;
      // 执行命令
      return window
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
      if (!this._checkPlan()) {
        return;
      }
      const result = this._addPlan();
      result
        .then((msg) => {
          this.$message({
            type: "success",
            message: msg,
            showClose: true,
          });
          this.$bus.$emit("getPlan", { ...this.plan });
        })
        .catch((reason) => {
          this.$message({
            type: "error",
            message: reason,
            duration: 10000,
            showClose: true,
          });
        });
    },
  },
  beforeMount() {
    this.plan.type = this.task.types[0].value;
    this.plan.cycle = this.task.cycle[0].value;
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
#planTime {
  width: 150px;
  margin-left: 20px;
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