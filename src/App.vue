<template>
  <div id="app">
    <PlanPanel></PlanPanel>
    <PlanList></PlanList>
  </div>
</template>

<script>
import PlanPanel from "@cpts/PlanPanel.vue";
import PlanList from "@cpts/PlanList.vue";
export default {
  name: "App",
  components: {
    PlanPanel,
    PlanList,
  },
  mounted() {
    this.$utils.exit();
  },
};
</script>

<style>
/* $message中html片段样式 */
.msg {
  white-space: pre-wrap;
}

/* 通用样式 */
* {
  margin: 0;
  padding: 0;
}

:root {
  --app-bg: #2d2e30;
  --panel-bg: #fff;
  --panel-min_w: 750px;
  /* Panel和List最小宽度 */
  --panel-max_w: 1000px;
  /* Panel和List最大宽度 */
  --panel-padding: 15px;
  /* Panel和List内边距 */
  --panel-between: 15px;
  /* Panel和List间隔 */
  --radius: 5px;
  --button-enable: #69b2fe;
  /* 状态按钮颜色 */
  --button-disable: #f56c6c;
  --button-danger: var(--button-disable);
  --danger-color: var(--panel-bg);
}

html,
body,
#app {
  width: 100%;
}

body::-webkit-scrollbar {
  display: none;
}

#app {
  background-color: var(--app-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

#plan-panel,
#plan-list {
  max-width: var(--panel-max_w);
  width: 90%;
  min-width: var(--panel-min_w);
  background-color: var(--panel-bg);
  border-radius: var(--radius);
  padding: var(--panel-padding);
  box-sizing: border-box;
  user-select: none;
}
</style>
