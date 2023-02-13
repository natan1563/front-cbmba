export default {
  state: {
    userData: null,
    accessToken: null
  },
  mutations: {
    SET_USER_DATA(state, payload) {
      state.userData = payload
    },
    SET_ACCESS_TOKEN(state, payload) {
      state.accessToken = payload
    },
  },
  actions: {
    SET_USER_DATA(context, payload) {
      context.commit('SET_USER_DATA', payload)
    },
    SET_ACCESS_TOKEN(context, payload) {
      context.commit('SET_ACCESS_TOKEN', payload)
    },
  },
  getters: {
    getUserData: state => state.userData,
    getUserToken: state => state?.accessToken,
  },
}