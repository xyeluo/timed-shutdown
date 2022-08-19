export const _localStorageRead={
  methods: {
    // 读取本地计划列表信息
    _localStorageRead() {
      const plans = localStorage.getItem("plans");
      if (!plans) {
        return [];
      }
      return JSON.parse(plans);
    },
  },

}