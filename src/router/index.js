import Vue from 'vue'
import Router from 'vue-router'
import Store from '../components/Store.vue'
import StoreOwner from '../components/StoreOwner.vue'
import Admin from '../components/Admin.vue'
import Owner from '../components/Owner.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Store',
      component: Store,
    },
    {
      path: '/storeowner',
      name: 'StoreOwner',
      component: StoreOwner,
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
    },
    {
      path: '/owner',
      name: 'Owner',
      component: Owner,
    }
  ]
})
