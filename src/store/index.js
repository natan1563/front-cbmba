import Vue from 'vue'
import Vuex from 'vuex'

import userStore from './app/userStore'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    userStore,
  },
})