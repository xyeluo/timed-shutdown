<template>
  <div id="plan-panel">
    <div class="item">
      <span class="instruct">任务类型</span>
      <el-select v-model="plan.type" size="small" placeholder="请选择">
        <el-option v-for="item in task.type" :key="item.value" :value="item.value" :label="item.label"> </el-option>
      </el-select>
      <div class="remote" @click="callRemote">
        <p>呼出系统自带远程关机（局域网内）</p>
      </div>
    </div>
    <div class="item">
      <label class="instruct" for="planName">任务名称</label>
      <el-input placeholder="例：每日关机" size="small" v-model.trim="plan.name" clearable></el-input>
    </div>
    <div class="item">
      <span class="instruct">执行周期</span>
      <el-select v-model="plan.cycle" size="small" placeholder="请选择">
        <el-option v-for="item in task.cycle" :key="item.value" :value="item.value" :label="item.label"> </el-option>
      </el-select>
      <!-- 执行周期为仅一次显示 -->
      <el-switch v-if="plan.cycle === 'once' ? true : false" v-model="plan.autoDelete" active-color="#13ce66" active-text="自动删除过期任务"> </el-switch>
      <!-- 执行周期为每月显示 -->
      <div class="notice" v-else-if="plan.cycle === 'monthly' ? true : false">
        <el-tooltip content="例：9月没有31日，当天的任务将顺延到下个月31日执行" placement="top-end">
          <el-alert title="当月没有的日期任务将会顺延到下个月" type="info" show-icon :closable="false"> </el-alert>
        </el-tooltip>
      </div>
    </div>
    <div id="planTime">
      <!-- 执行周期为仅一次显示 -->
      <el-date-picker
        class="item tag"
        v-if="plan.cycle === 'once' ? true : false"
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
        class="item tag"
        v-else-if="plan.cycle === 'weekly' ? true : false"
        v-model="plan.weekly"
        size="small"
        multiple
        placeholder="请选择"
        :style="[
          { transition: 'width .5s linear' },
          {
            width: plan.weekly.length ? 90 + plan.weekly.length * 60 + 'px' : '90px',
          },
        ]"
      >
        <el-option v-for="item in task.weekly" :key="item.value" :value="item.value" :label="item.label"> </el-option>
      </el-select>
      <!-- 执行周期为每月显示 -->
      <div class="item monthly" v-else-if="plan.cycle === 'monthly' ? true : false">
        <span class="instruct">日期</span>
        <el-checkbox-group size="mini" v-model="plan.daysOfMonth">
          <el-checkbox border v-for="(item, index) in 31" :key="index" :label="item"></el-checkbox>
        </el-checkbox-group>
      </div>
      <el-time-picker class="item tag" v-model.trim="plan.datetime" placeholder="执行时间" size="small" format="HH:mm" :value-format="plan.cycle === 'monthly' ? 'yyyy-MM-ddTHH:mm' : 'HH:mm'">
      </el-time-picker>
    </div>
    <div class="item">
      <el-button type="primary" @click="addRow">创建计划</el-button>
    </div>
  </div>
</template>

<script>
import { throotle, panelTask } from '@mix/index.js';

export default {
  name: 'PlanPanel',
  data() {
    return {
      // 初始化计划所需参数
      plan: {
        type: '',
        name: '',
        cycle: '',
        day: '',
        daysOfMonth: [],
        weekly: [],
        datetime: '',
        autoDelete: true,
      },
    };
  },
  watch: {
    'plan.cycle': {
      immediate: true,
      handler(newVal) {
        this.plan.datetime = '';
        if (newVal !== 'once') {
          this.plan.autoDelete = false;
          return;
        }
        this.plan.autoDelete = true;
      },
    },
  },
  mixins: [throotle, panelTask],
  methods: {
    /**
     * @Description: 判断是否是windows系统
     * @return {boolen} true:是 false:不是
     */
    _isWin() {
      const resutl = utools.isWindows();
      if (!resutl) {
        this.$confirm({
          msg: '<p>该插件仅支持<b>Windows</b>系统</p>',
          title: '提醒',
          center: true,
          showCancelButton: false,
          closeOnClickModal: false,
        });
      }
      return resutl;
    },
    /**
     * @Description: 检查任务所需参数是否完整
     * @return {boolen} true:验证通过; false:缺少信息，验证不通过
     */
    _checkPlan() {
      const { type, name, datetime, cycle, day, weekly, daysOfMonth } = this.plan,
        // 统一通知
        warningMsg = (message) => {
          this.$message({ type: 'warning', message });
          return false;
        };
      if (type === '' || type === null) return warningMsg('任务类型未填写！');
      if (name === '' || name === null) return warningMsg('任务名称未填写！');
      if (cycle === 'once' && (day === '' || day === null)) return warningMsg('执行周期缺少具体日期！');

      if (cycle === 'weekly' && weekly.length === 0) return warningMsg('执行周期缺少星期！');

      if (cycle === 'monthly' && daysOfMonth.length === 0) return warningMsg('执行周期缺少日期！');

      if (datetime === '' || datetime === null) return warningMsg('执行周期缺少时间！');

      return true;
    },
    /**
     * @Description: 检查任务名称是否重名
     * @return {boolen} true:存在重名; false:没有重名
     */
    _repeatPlan() {
      let temp = false;
      const plans = this.$utils.dbStorageRead(),
        result = plans.find((item) => {
          return item.name === this.plan.name;
        });

      // 查询到同名的任务
      if (result !== undefined) {
        this.$message({
          type: 'warning',
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
          shutdown: '-s -t 00 -f',
          reboot: '-r -t 00 -f',
          dormancy: '-h',
        },
        { type, name, cycle, datetime, day, weekly, daysOfMonth } = this.plan,
        baseCmd = `schtasks /create /tn "${name}"`; // 定义基础命令

      let cmd = `${baseCmd} /sc ${cycle} /tr "shutdown ${types[type]}" /st ${datetime}`;

      // 补充命令
      const panelModifyCmdByCycle = {
        once: () => {
          let tempTime = `${day} ${datetime}`;

          // 如果计划时间小于当前时间，则失败
          if (Date.parse(new Date()) >= Date.parse(tempTime)) {
            return {
              line: '~254',
              message: '计划时间小于当前时间！',
            };
          }
          return (cmd += ` /sd ${day}`);
        },
        // schtasks /create /sc weekly /tn "test" /tr "calc.exe" /st "08:30" /d fri
        weekly: () => (cmd += ` /d ${weekly.toString()}`),
        monthly: async () => {
          try {
            let path = await this.$utils.createXML({
              daysOfMonth,
              datetime,
              argu: types[type],
            });
            return (cmd = `${baseCmd} /xml "${path}"`);
          } catch (error) {
            return {
              line: '~266',
              message: error,
            };
          }
        },
      };
      return typeof panelModifyCmdByCycle[cycle] === 'function' ? panelModifyCmdByCycle[cycle]() : cmd;
    },
    // 执行添加计划命令
    async _addPlan() {
      const cmd = await this._setCmd();
      if (typeof cmd === 'object') {
        return Promise.reject(`${cmd.message}(${cmd.line})`);
      }
      // 执行命令
      return this.$utils
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
      if (!this._isWin() || !this.throotle() || !this._checkPlan() || this._repeatPlan()) {
        return;
      }
      this._addPlan()
        .then((msg) => {
          this.$message({ message: msg });
          // 数据传递给List，由List添加到dbStroage
          this.$bus.$emit('getPlan', { ...this.plan });
          // 任务置空
          this.plan.name = this.plan.datetime = this.plan.day = '';
          this.plan.weekly = this.plan.daysOfMonth = [];
        })
        .catch((reason) => {
          this.$message({
            type: 'error',
            message: reason,
          });
        });
    },
    // 打开远程关机对话框
    callRemote() {
      if (!this.throotle()) {
        return;
      }
      this.$utils.execCmd('shutdown -i');
    },
  },
  beforeMount() {
    this._isWin();
    utools.onPluginEnter(({ code }) => {
      this.plan.type = code;
    });
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

.el-select:deep() .el-input__inner::selection {
  background-color: transparent;
}
.el-select:deep() .el-select__tags {
  height: 24px;
  overflow: hidden;
}

:deep() .el-switch__label {
  color: #bdc3c7;
}

:deep() .el-switch__label.is-active {
  color: var(--button-enable);
}

#planTime input::selection {
  background-color: var(--button-enable);
  color: var(--panel-bg);
}

#planTime .el-date-editor {
  width: 150px;
}

.el-switch {
  margin: 4.5px 0 0 20px;
}

label.el-checkbox.el-checkbox--mini.is-bordered {
  margin-left: 0;
}

/* panel样式 */
.flex,
.item,
#plan-panel {
  display: flex;
}

#plan-panel {
  flex-direction: column;
  margin-bottom: var(--panel-between);
}

#planTime > .tag {
  display: block;
  margin-left: 70px;
}

.remote {
  margin-left: auto;
  color: var(--button-enable);
  text-decoration: underline;
}

.remote:hover {
  filter: brightness(0.8);
  cursor: pointer;
}

.item {
  margin: 10px;
  line-height: 32px;
}

.item .el-button {
  margin-left: 42px;
}

.instruct {
  margin-right: 5px;
}

.monthly .instruct {
  margin: 0 10px 0 22px;
  white-space: nowrap;
}

input[type='number'] {
  width: 50px;
}

.notice {
  line-height: 18px;
  margin-left: 20px;
}
</style>
