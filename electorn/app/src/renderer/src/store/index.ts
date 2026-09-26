import { legacy_createStore } from 'redux'
import { reducer } from './reducert'

// 创建 store 实例
const store = legacy_createStore(reducer)

export default store
