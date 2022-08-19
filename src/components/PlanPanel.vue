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
        placeholder="必填"
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
      <el-button type="primary" @click="addPlan">创建计划</el-button>
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
        // start_Date: {
        //   disabledDate(time) {
        //     return time.getTime() < Date.now() - 24 * 3600 * 1000;
        //   },
        // },
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
    addPlan() {
      if (!this._checkPlan()) {
        return;
      }
      // 确定命令执行类型，关机|重启|休眠
      const types = {
          shutdown: "-s",
          reboot: "-r",
          dormancy: "-h",
        },
        { type, name, cycle, datetime } = this.plan,
        msgParm = {
          type: "success",
          duration: 3000,
        },
        // 定义命令
        cmd = `schtasks /create /sc ${cycle} /tn "${name}" /tr "shutdown ${types[type]} -t 00" /st ${datetime}`;
      // 执行命令
      window.execCmd(cmd, (result) => {
        if (result.indexOf("成功") == -1) {
          msgParm = {
            type: "error",
            duration: 10000,
          };
        }
        this.$message({
          ...msgParm,
          showClose: true,
          message: result,
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
  min-width: var(--panel-min_w);
  background-color: var(--panel-bg);
  border-radius: var(--radius);
  padding: var(--panel-padding);
  box-sizing: border-box;
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
  margin: 0 auto;
}
.instruct {
  margin-right: 5px;
  line-height: 32px;
}
input[type="number"] {
  width: 50px;
}
</style>