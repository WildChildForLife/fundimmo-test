import Vue from 'vue';
import BootstrapVue, { TablePlugin } from 'bootstrap-vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.min.css';

Vue.use(BootstrapVue);

Vue.use(TablePlugin);

new Vue({
  el: '#app',
  render: h => h(App)
})
