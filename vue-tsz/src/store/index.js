import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

//存放变量的值
const state = {
  AllCityUniversities:[],
  CurrentMode:0, //user info mode-> mode:0 login mode:1 Register
  CurrentCookie:'',
  isLogined:false,
};

const getters = {
  getAllCityUniversities(){
    return state.AllCityUniversities;
  },
  getClickRegisterModel(state){
    return state.CurrentMode;
  },
  getCurrentCookie(state){
    return state.CurrentCookie;
  },
  getLogined(state){
    return state.isLogined;
  }
};

const mutations = {
  setAllCityUniversities(state, cities){
    state.AllCityUniversities = cities;
  },
  //mode 0 Login
  //mode 1 Register
  setCurrentMode(state, mode){
    state.CurrentMode = mode;
  },
  setCurrentCookie(state, cookie){
    state.CurrentCookie = cookie;
  },
  setLogined(state, logined){
    state.isLogined = logined;
  }

}

const actions = {
    setCities (context, cities) {
        context.commit('setAllCityUniversities', cities);
    },
    asyncCurrentMode(commit, mode){
      commit('setCurrentMode', mode);
    },
    asyncCurrentCookie(commit, cookie){
      commit('setCurrentCookie', cookie);
    },
    asyncLogined(commit, flag){
      commit('setLogined', flag);
    }
};

const store = new Vuex.Store({
  state,    // 共同维护的一个状态，state里面可以是很多个全局状态
  getters,  // 获取数据并渲染
  actions,  // 数据的异步操作
  mutations  // 处理数据的唯一途径，state的改变或赋值只能在这里
});

export default store
