import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import panZoom from 'vue-panzoom';
import FlowyPlugin from "@hipsjs/flowy-vue";
import "@hipsjs/flowy-vue/dist/lib/flowy-vue.css";

Vue.config.productionTip = false

Vue.use(panZoom);
Vue.use(FlowyPlugin);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
