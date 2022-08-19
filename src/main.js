import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  render: function (h) { return h(App) },
  beforeCreate() {
    Vue.prototype.$bus = this;
  }
}).$mount('#app')
