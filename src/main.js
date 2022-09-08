import Vue from 'vue'
import App from './App.vue'
import '@pln/element';

Vue.config.productionTip = false

new Vue({
  render: function (h) { return h(App) },
  beforeCreate() {
    Vue.prototype.$bus = this;
    Vue.prototype.$utils = window.utils;
  }
}).$mount('#app')
