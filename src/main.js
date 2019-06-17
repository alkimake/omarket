import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import store from './store'
import router from './router'

import { mapState, mapActions } from 'vuex'
import { ACTION_TYPES } from './util/constants'

Vue.config.devtools = true
Vue.config.productionTip = false

Vue.use(Vuex);

new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  computed: {
    ...mapState({
      hasInjectedWeb3: state => state.web3.isInjected,
      hasWeb3InjectedBrowser: state => state.user.hasWeb3InjectedBrowser,
      hasCoinbase: state => state.user.hasCoinbase,
      networkId: state => state.web3.networkId,
      coinbase: state => state.web3.coinbase,
      currentRoute: state => state.currentRoute,
      currentView: state => state.currentView,
      isDAppReady: state => state.isDAppReady,
      defaultRoute: state => state.defaultRoute
    })
  },
  watch: {
    hasInjectedWeb3 (web3ConnectionValue) {
      console.log('hasInjectedWeb3: ', web3ConnectionValue)
    },
    networkId (networkId) {
      console.log('networkId: ', networkId)
    },
    coinbase (coinbase) {
      console.log('coinbase: ', coinbase)
    },
    isDAppReady (isDAppReady) {
      console.log('isDAppReady: ', isDAppReady)
    },
    accounts (accounts) {
      console.log('accounts: ', accounts)
    },
    $route (newRoute) {
      this[ACTION_TYPES.CHANGE_CURRENT_ROUTE_TO](newRoute)
      this[ACTION_TYPES.SET_CURRENT_VIEW](newRoute)
    }
  },
  beforeCreate: async function () {
    try {
      await this.$store.dispatch(ACTION_TYPES.REGISTER_WEB3_INSTANCE);
    } catch (error) {
      if (!(this.isDAppReady)) {
        this.$store.dispatch(ACTION_TYPES.UPDATE_DAPP_READINESS, true)
      }
      console.error(this.$store.state.web3.error, 'Unable to REGISTER_WEB3_INSTANCE')
    }
  },
  created: function () {
    this[ACTION_TYPES.CHANGE_CURRENT_ROUTE_TO](this.$route)
    this[ACTION_TYPES.SET_CURRENT_VIEW](this.$route)
  },
  methods: {
    ...mapActions([
      ACTION_TYPES.CHANGE_CURRENT_ROUTE_TO,
      ACTION_TYPES.SET_CURRENT_VIEW,
    ]),
  },
  template: '<App  :is-d-app-ready="isDAppReady" :current-view="currentView"/>',
})
