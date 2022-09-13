<template>
  <div id="plan-list">
    <h2 id="title">计划列表</h2>
    <el-table :data="plans" max-height="450" v-if="plans.length !== 0">
      <el-table-column fixed prop="name" label="任务名称"> </el-table-column>
      <el-table-column fixed prop="type" label="任务类型"> </el-table-column>
      <el-table-column fixed prop="cycle" label="执行周期"> </el-table-column>
      <el-table-column fixed prop="datetime" label="执行日期" width="190"> </el-table-column>
      <el-table-column fixed label="状态">
        <template slot-scope="scope">
          <div class="status enable" v-if="scope.row.status" @click="changeStatus(scope)">
            <span>运行中</span>
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 24V11.8756L25.5 17.9378L36 24L25.5 30.0622L15 36.1244V24Z" />
            </svg>
          </div>
          <div class="status disable" v-else @click="changeStatus(scope)">
            <span>已暂停</span>
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 12V36" />
              <path d="M32 12V36" />
            </svg>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click.native.prevent="deleteRow(scope, plans)" type="danger" size="small">
            {{ scope.row.autoDelete ? '自动删除' : '移除' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { throotle, reverseKeyValueSourceTask } from '@mix/index.js';

export default {
  name: 'PlanList',
  data() {
    return {
      plans: [],
    };
  },
  watch: {
    plans: {
      deep: true,
      handler() {
        this.$utils.dbStorageSave(this.plans);
      },
    },
  },
  mixins: [throotle],
  methods: {
    // 执行删除计划命令
    _deletePlan(planName) {
      const cmd = `schtasks /delete /tn "${planName}" /f`;
      return this.$utils
        .execCmd(cmd)
        .then((result) => {
          return Promise.resolve(result);
        })
        .catch((reason) => {
          return Promise.reject(reason);
        });
    },
    // 删除相应行的计划列表
    deleteRow(scope, rows) {
      const result = this._deletePlan(scope.row.name);
      result
        .then((msg) => {
          this.$message({ message: msg });

          // 删除行
          rows.splice(scope.$index, 1);
        })
        .catch((reason) => {
          this.$confirm({
            msg: '<p>是否强制从<b>插件计划列表</b>中移除</p>',
            title: reason,
            customClass: 'danger',
          }).then(() => {
            rows.splice(scope.$index, 1);
          });
        });
    },
    // 添加计划列表
    _getPlan(plan) {
      const planInfo = reverseKeyValueSourceTask,
        listModifyCmdByCycle = {
          once: () => {
            // 仅一次周期下把日期、时间拼接到执行日期一起显示
            plan.datetime = `${plan.day} ${plan.datetime}`;
          },
          weekly: () => {
            // 存储转化、排序后的星期
            let tempWeekly = [];
            plan.weekly.forEach((week) => {
              tempWeekly.push({
                no: Object.keys(planInfo.weekly).findIndex((item) => item === week),
                week: planInfo.weekly[week],
              });
            });
            tempWeekly = tempWeekly.sort((prev, next) => prev.no - next.no);
            tempWeekly.forEach((item, index) => {
              tempWeekly[index] = item.week;
            });
            tempWeekly = tempWeekly.join('、') + ' ';
            if (plan.weekly.length >= 2) {
              tempWeekly += '\n';
            }
            plan.datetime = `${tempWeekly}${plan.datetime}`;
          },
          monthly: () => {
            let temp = plan.daysOfMonth.sort((prev, next) => prev - next);
            temp.forEach((day, index) => {
              temp[index] = `${day}日`;
            });
            temp = temp.join(',');
            if (plan.daysOfMonth.length >= 4) {
              temp += '\n';
            }
            //2022-09-08T18:30
            plan.datetime = plan.datetime.split('T')[1];
            plan.datetime = `${temp}${plan.datetime}`;
          },
        };
      if (listModifyCmdByCycle[plan.cycle]) {
        listModifyCmdByCycle[plan.cycle]();
      }
      this.$set(plan, 'status', true);
      plan.type = planInfo.type[plan.type];
      plan.cycle = planInfo.cycle[plan.cycle];
      plan.datetime = plan.datetime.replace(/:/, '时') + '分';
      this.plans.unshift(plan);
    },
    // 改变任务状态
    changeStatus({ row }) {
      if (!this.throotle()) {
        return;
      }
      let status = '/disable';
      if (!row.status) {
        status = '/enable';
      }
      const cmd = `schtasks /change /tn "${row.name}" ${status}`;
      return this.$utils
        .execCmd(cmd)
        .then((result) => {
          this.$message({ message: result });
          row.status = !row.status;
        })
        .catch((reason) => {
          this.$message({
            type: 'error',
            message: reason,
          });
        });
    },
    // 删除过期任务
    _deleteTypeOncePlan() {
      this.plans = this.plans.filter((item) => {
        // 保留没有开启自动删除，或者开启自动删除但计划时间大于当前时间的任务
        if (!item.autoDelete || (item.autoDelete && new Date(item.datetime) > Date.now())) {
          return true;
        }
        this._deletePlan(item.name).catch(() => {});
      });
    },
  },
  beforeMount() {
    // 先读取storage
    this.plans = this.$utils.dbStorageRead();
    this._deleteTypeOncePlan();
    this.$bus.$on('getPlan', this._getPlan);
  },
  destroyed() {
    this.$bus.$off('showResult');
  },
};
</script>
<style>
.danger .el-message-box__btns .el-button--primary {
  color: var(--danger-color);
  background-color: var(--button-danger);
  border-color: var(--button-danger);
}
</style>
<style scoped>
.el-table:deep() td,
.el-table:deep() th {
  text-align: center;
}

.el-table:deep() tbody .el-table_1_column_4 .cell {
  white-space: pre-line;
}

.el-table:deep() .el-table__fixed-body-wrapper {
  user-select: text;
}

#plan-list {
  margin-top: var(--panel-between);
  box-sizing: border-box;
}

#title {
  font-weight: 600;
  font-size: 16px;
}

#plan {
  white-space: pre-wrap;
}

.status {
  display: flex;
  justify-content: center;
  cursor: default;
  user-select: none;
}

.status svg {
  --w-h: 24px;
  width: var(--w-h);
  height: var(--w-h);
  stroke-width: 4;
}

.enable {
  color: var(--button-enable);
}

.enable svg path {
  fill: var(--button-enable);
  stroke: var(--button-enable);
  stroke-linejoin: round;
}

.disable {
  color: var(--button-disable);
}

.disable svg path {
  fill: var(--button-disable);
  stroke: var(--button-disable);
  stroke-linecap: round;
  stroke-linejoin: round;
}

.status:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
