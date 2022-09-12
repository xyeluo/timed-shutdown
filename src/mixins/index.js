function modifySourceTask() {
  const sourceTask = {
    // 类型
    type: [
      ["重启", "reboot"],
      ["关机", "shutdown"],
      ["休眠", "dormancy"],
    ],
    // 周期
    cycle: [
      ["仅一次", "once"],
      ["每天", "daily"],
      ["每周", "weekly"],
      ["每月", "monthly"],
    ],
    // 星期数,在beforeMount中渲染
    weekly: [
      ["日", "sun"],
      ["一", "mon"],
      ["二", "tue"],
      ["三", "wed"],
      ["四", "thu"],
      ["五", "fri"],
      ["六", "sat"],
    ],
  };
  let label = "";
  for (const key of Object.keys(sourceTask)) {
    initTask[key] = reverseKeyValueSourceTask[key] = [];
    if (key === "weekly") {
      label = "星期";
    }
    for (const item of sourceTask[key]) {
      initTask[key].push({ label: `${label}${item[0]}`, value: item[1] });
      reverseKeyValueSourceTask[key][item[1]] = `${label}${item[0]}`;
    }
  }
}

const throotle = {
  data() {
    return {
      flag: true,
    }
  },
  methods: {
    /**
     * @Description: 给按钮添加节流
     * @return {boolen} true:可以执行后续命令，false:不能执行后续命令  
     */
    throotle() {
      if (this.flag) {
        this.flag = false;
        setTimeout(() => {
          this.flag = true;
        }, 800);
        return true;
      }
      return false;
    },
  },
}

let initTask = {},
  reverseKeyValueSourceTask = {};
modifySourceTask();

const panelTask = {
  data() {
    return {
      // 任务提供的可选参数
      task: {
        // 可选日期，从系统当前日期开始
        start_Date: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 24 * 3600 * 1000;
          },
        },
        ...initTask,
      },
    }
  },
}

export {
  panelTask,
  reverseKeyValueSourceTask,
  throotle
};