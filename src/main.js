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
      },
      user: {},
      subscribedEvents: {},
    };
  },
  computed: {
    oMarket: function () {
      return (this.web3 && this.web3.instance) ? this.web3.instance.methods : null;
    }
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
    }
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
      // this.subscribeLogEvent(OMarketContract, 'AdminAdded')
      // this.subscribeLogEvent(OMarketContract, 'AdminRemoved')
      await this.getUserBasics();
    } catch (error) {
      this.web3.error = error;
      console.error(error, 'Unable to register web3 instance')
    }
  },
  methods: {
    contractSend: async function(method, ...args) {
      //FIXME: Wait calling methods until web3 is ready
      try {
        console.log(`args ${args} sending to ${method}`);
        const result = await this.oMarket[method](...args).send({from: this.web3.coinbase});
        console.log(`method send: "${method}" returned ${result}`);
        return result;
      } catch(err) {
        // console.error("Error occured on transaction", err);
        return null;
      }
    },
    contractCall: async function(method, ...args) {
      //FIXME: Wait calling methods until web3 is ready
      try {
        console.log(`${method} is calling with args ${args}`);
        const result = await this.oMarket[method](...args).call();
        console.log(`method: "${method}" returned ${result}`);
        return result;
      } catch(err) {
        // console.error("Error occured on transaction", err);
        return null;
      }
    },
    getUserBasics: async function() {
      try {
        const owner = await this.oMarket.owner().call();
        const isOwner = owner === this.web3.accounts[0];
        const isAdmin = await this.oMarket.isAdmin().call();
        this.user = { isOwner, isAdmin };
      } catch(error) {
        console.error(error);
      }
    }
  },
  template: '<App/>',
})
