import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Vuex from 'vuex'
import store from './store'
import router from './router'

Vue.use(Vuex)
Vue.config.productionTip = false
Vue.prototype.$root = new Vue()

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
