<template>
  <div id="plan-list">
    <h2 id="title">计划列表</h2>
    <p id="result">{{ result }}</p>
  </div>
</template>

<script>
export default {
  name: "PlanList",
  data() {
    return {
      result: "",
      height: "",
    };
  },
  mounted() {
    this.$bus.$on("showResult", (result) => {
      this.result = result;
      this.height = "100px";
    });
  },
  destroyed() {
    this.$bus.$off("showResult");
  },
};
</script>

<style scoped>
#plan-list {
  min-width: var(--panel-min_w);
  background-color: var(--panel-bg);
  border-radius: var(--radius);
  padding: var(--panel-padding);
  box-sizing: border-box;
}
#title{
  font-weight: 600;
  font-size: 16px;
}
#result {
  white-space: pre-wrap;
}
</style>