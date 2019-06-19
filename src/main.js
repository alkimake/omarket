import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'

import OMarketContract from "./contracts/OMarket.json";
import getWeb3 from './util/web3/getWeb3'

Vue.config.devtools = true
Vue.config.productionTip = false

Vue.use(ElementUI);

const connectToNetwork = async () => {
  const web3 = await getWeb3();

  // Use web3 to get the user's accounts.
  const accounts = await web3.eth.getAccounts();
  const networkId = await web3.eth.net.getId();

  const coinbase = await web3.eth.getCoinbase();
  const hasInjectedWeb3 = await web3.eth.net.isListening();

  const deployedNetwork = OMarketContract.networks[networkId];
  const instance = new web3.eth.Contract(
    OMarketContract.abi,
    deployedNetwork && deployedNetwork.address,
  );

  return { web3, accounts, networkId, coinbase, hasInjectedWeb3, instance };
}

new Vue({
  el: '#app',
  router,
  components: { App },
  data() {
    return {
      web3: {
        handle: null,
        accounts: [],
        coinbase: null,
        error: null,
        instance: null,
        isInjected: false,
        networkId: null
      }
    };
  },
  watch: {
    'web3.hasInjectedWeb3': (web3ConnectionValue) => {
      console.log('hasInjectedWeb3: ', web3ConnectionValue)
    },
    'web3.networkId': (networkId) => {
      console.log('networkId: ', networkId)
    },
    'web3.coinbase': (coinbase) => {
      console.log('coinbase: ', coinbase)
    },
    isDAppReady: (isDAppReady) => {
      console.log('isDAppReady: ', isDAppReady)
    },
    'web3.accounts': (accounts) => {
      console.log('accounts: ', accounts)
    },
  },
  beforeCreate: async function () {
    try {
      const web3 = await connectToNetwork();
      this.web3.handle = web3.web3;
      this.web3.accounts = web3.accounts;
      this.web3.coinbase = web3.coinbase;
      this.web3.isInjected = web3.hasInjectedWeb3;
      this.web3.networkId = web3.networkId;
      this.web3.instance = web3.instance;
      // const response = await web3.instance.methods.owner().call({from: web3.coinbase });
      // console.log('response is', response);
    } catch (error) {
      this.web3.error = error;
      console.error(error, 'Unable to register web3 instance')
    }
  },
  template: '<App/>',
})
