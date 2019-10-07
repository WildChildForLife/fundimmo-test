import Vue from 'vue'
import App from './App.vue'
import InertiaTable from 'inertia-table'
import axios from 'axios'

Vue.config.productionTip = false;
Vue.use(InertiaTable);

new Vue({
  render: h => h(App),
  data () {
    return {
      countries: null
    }
  },
  mounted () {
    axios
        .get('http://localhost:3000/pays/3').then((response) => {
            this.countries = response.data;
        });
  }
}).$mount('#app')
