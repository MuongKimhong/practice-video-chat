import VuexPersistence from 'vuex-persist'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default new Vuex.Store({
  plugins: [vuexLocal.plugin],

  state: {
    userInfo: null,
    baseUrl: 'http://localhost:3000/'
  },

  mutations: {
    getUserInfo: function (state, credentials) {
      state.userInfo = credentials
    },
    deleteUserInfo: function (state) {
      state.userInfo = null
    }
  },

  actions: {},
  modules: {}
})
