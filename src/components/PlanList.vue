<template>
  <div id="plan-list">
    <h2 id="title">计划列表</h2>
    <el-table :data="plans" max-height="280">
      <el-table-column fixed prop="name" label="任务名称"> </el-table-column>
      <el-table-column fixed prop="type" label="任务类型"> </el-table-column>
      <el-table-column fixed prop="cycle" label="执行周期"> </el-table-column>
      <el-table-column fixed prop="datetime" label="执行日期" width="150">
      </el-table-column>
      <el-table-column fixed label="状态">
        <template slot-scope="scope">
          <div
            class="status enable"
            v-if="scope.row.status"
            @click="changeStatus(scope)"
          >
            <span>运行中</span>
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15 24V11.8756L25.5 17.9378L36 24L25.5 30.0622L15 36.1244V24Z"
              />
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
          <el-button
            @click.native.prevent="deleteRow(scope, plans)"
            type="danger"
            size="small"
          >
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import throotle from "@mix/index.js";
const utils = window.utils;

export default {
  name: "PlanList",
  data() {
    return {
      plans: [],
    };
  },
  mixins: [throotle],
  methods: {
    // 执行删除计划命令
    _deletePlan(planName) {
      const cmd = `schtasks /delete /tn "${planName}" /f`;
      return utils
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

          // 每次移除都覆盖一次计划列表
          utils.dbStorageSave(this.plans);
        })
        .catch((reason) => {
          this.$confirm({
            msg: "<p>是否强制从<b>插件计划列表</b>中移除</p>",
            title: reason,
            customClass: "danger",
          }).then(() => {
            rows.splice(scope.$index, 1);
            utils.dbStorageSave(this.plans);
          });
        });
    },
    // 添加计划列表
    _getPlan(plan) {
      if (plan.cycle === "once") {
        // 仅一次周期下把日期、时间拼接到执行日期一起显示
        plan.datetime = `${plan.day} ${plan.datetime}`;
      }
      if (plan.cycle === "weekly") {
        const weekly = {
          sun: "日",
          mon: "一",
          tue: "二",
          wed: "三",
          thu: "四",
          fri: "五",
          sat: "六",
        };
        plan.datetime = `星期${weekly[plan.weekly]} ${plan.datetime}`;
      }
      const planInfo = {
        type: {
          reboot: "重启",
          shutdown: "关机",
          dormancy: "休眠",
        },
        cycle: {
          daily: "每天",
          once: "仅一次",
          weekly: "每周",
        },
      };
      this.$set(plan, "status", true);
      plan.type = planInfo.type[plan.type];
      plan.cycle = planInfo.cycle[plan.cycle];
      this.plans.unshift(plan);

      // 每次添加都覆盖一次计划列表
      utils.dbStorageSave(this.plans);
    },
    // 改变任务状态
    changeStatus({ row }) {
      if (!this.throotle()) {
        return;
      }
      let status = "/disable";
      if (!row.status) {
        status = "/enable";
      }
      const cmd = `schtasks /change /tn "${row.name}" ${status}`;
      return utils
        .execCmd(cmd)
        .then((result) => {
          this.$message({ message: result });
          row.status = !row.status;
          utils.dbStorageSave(this.plans);
        })
        .catch((reason) => {
          this.$message({
            type: "error",
            message: reason,
          });
        });
    },
  },
  mounted() {
    // 先读取storage
    this.plans = utils.dbStorageRead();
    this.$bus.$on("getPlan", this._getPlan);
  },
  destroyed() {
    this.$bus.$off("showResult");
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
}
</style>
