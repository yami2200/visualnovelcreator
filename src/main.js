import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import panZoom from 'vue-panzoom';

Vue.config.productionTip = false

Vue.use(panZoom);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
