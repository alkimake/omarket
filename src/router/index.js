import Vue from 'vue'
import Router from 'vue-router'
import Store from '../components/Store.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Store',
      component: Store,
    }
  ]
})
