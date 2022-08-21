<template>
  <div id="plan-list">
    <h2 id="title">计划列表</h2>
    <el-table :data="plans" max-height="280">
      <el-table-column fixed prop="name" label="任务名称"> </el-table-column>
      <el-table-column fixed prop="type" label="任务类型"> </el-table-column>
      <el-table-column fixed prop="cycle" label="执行周期"> </el-table-column>
      <el-table-column fixed prop="datetime" label="执行日期">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="deleteRow(scope, plans)"
            type="text"
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
const utils = window.utils;

export default {
  name: "PlanList",
  data() {
    return {
      plans: [],
    };
  },
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
          this.$message({
            type: "success",
            message: msg,
            showClose: true,
          });
          // 删除行
          rows.splice(scope.$index, 1);
          // 每次移除都覆盖一次计划列表
          utils.dbStorageSave(this.plans);
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
  mounted() {
    // 先读取storage
    this.plans = utils.dbStorageRead();
    this.$bus.$on("getPlan", (plan) => {
      const planInfo = {
        type: {
          reboot: "重启",
          shutdown: "关机",
          dormancy: "休眠",
        },
        cycle: {
          daily: "每天",
          once: "仅一次",
        },
      };
      plan.type = planInfo.type[plan.type];
      plan.cycle = planInfo.cycle[plan.cycle];
      if (plan.cycle === "once") {
        plan.datetime = `${plan.day} ${plan.datetime}`;
      }
      this.plans.unshift(plan);
      // 每次添加都覆盖一次计划列表
      utils.dbStorageSave(this.plans);
    });
  },
  destroyed() {
    this.$bus.$off("showResult");
  },
};
</script>

<style scoped>
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
</style>