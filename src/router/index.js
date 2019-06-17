import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home'
import Web3Message from '../components/sections/Web3Message.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      mode: 'history',
      path: '/',
      name: 'Root',
      component: Home,
      meta: { view: Web3Message }
    }
  ]
})
