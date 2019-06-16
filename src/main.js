import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'

Vue.config.devtools = true
Vue.config.productionTip = false

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
  	increment: state => state.count++,
    decrement: state => state.count--
  }
})


new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
