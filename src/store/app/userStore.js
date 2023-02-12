export default {
  state: {
    userData: null,
  },
  mutations: {
    SET_USER_DATA(state, payload) {
      state.userData = payload
    },
  },
  actions: {
    SET_USER_DATA(context, payload) {
      context.commit('SET_USER_DATA', payload)
    },
  },
  getters: {
    getUserData: state => state.userData,
    getUserToken: state => state.userData?.token,
  },
}