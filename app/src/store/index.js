// import Vue from "vue";
// import Vuex from "vuex";
import User from "./module/user";
import Setting from "./module/setting";
import Global from "./module/global";
// Vue.use(Vuex);
export default new Vuex.Store({
  mutations: {},
  actions: {},
  modules: {
    User,
    Setting,
    Global,
  }
});
