import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

//存放变量的值
const state = {
  AllCityUniversities:[],
  CurrentMode:0,
};

const getters = {
  getAllCityUniversities(){
    return state.AllCityUniversities;
  },
  getClickRegisterModel(state){
    return state.CurrentMode;
  }
};

const mutations = {
  setAllCityUniversities(state, cities){
    state.AllCityUniversities = cities;
  },
  //mode 0 Login
  //mode 1 Register
  setCurrenMode(state, mode){
    state.CurrentMode = mode;
  }

}

const actions = {
    setCities (context, cities) {
        context.commit('setAllCityUniversities', cities);
    },
    asyncCurrentMode:({commit}, mode)=>{
      commit('setCurrenMode', mode)
    }
};

const store = new Vuex.Store({
  state,    // 共同维护的一个状态，state里面可以是很多个全局状态
  getters,  // 获取数据并渲染
  actions,  // 数据的异步操作
  mutations  // 处理数据的唯一途径，state的改变或赋值只能在这里
});

export default store
