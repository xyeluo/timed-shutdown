export const throotle = {
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