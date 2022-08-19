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
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
:root {
  --app-bg: #2d2e30;
  --panel-bg: #fff;
  --panel-min_w: 750px; /* Panel和List宽度 */
  --panel-padding: 15px; /* Panel和List内边距 */
  --panel-between: 15px; /* Panel和List间隔 */
  --radius: 5px;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
}

#app {
  background-color: var(--app-bg);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
</style>
