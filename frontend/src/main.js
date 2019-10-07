import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import { TablePlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.min.css';

Vue.use(BootstrapVue);
Vue.use(TablePlugin);

import App from './App.vue'

new Vue({
  el: '#app',
  render: h => h(App)
});
