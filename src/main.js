import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'

import OMarketContract from "./contracts/OMarket.json";
import StoreContract from "./contracts/Store.json";
import getWeb3 from './util/web3/getWeb3'
import { blockie } from './util/icon';

import { APPROVED_NETWORK_ID } from './util/constants'

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
        networkId: null,
        isConnectedToApprovedNetwork: false,
        isDAppReady: false,
      },
      user: {},
      subscribedEvents: {},
      consoleData: [],
    };
  },
  computed: {
    oMarket: function () {
      return (this.web3 && this.web3.instance) ? this.web3.instance.methods : null;
    },
  },
  watch: {
    'web3.isInjected': (web3ConnectionValue) => {
      console.log('isInjected: ', web3ConnectionValue)
    },
    'web3.networkId': (networkId) => {
      console.log('networkId: ', networkId)
    },
    'web3.coinbase': (coinbase) => {
      console.log('coinbase: ', coinbase)
    },
    'web3.isDAppReady': (isDAppReady) => {
      console.log('isDAppReady: ', isDAppReady)
    },
    'web3.accounts': (accounts) => {
      console.log('accounts: ', accounts)
    },
    'web3.isConnectedToApprovedNetwork': (isConnectedToApprovedNetwork) => {
      console.log('isConnectedToApprovedNetwork', isConnectedToApprovedNetwork);
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
      this.web3.isConnectedToApprovedNetwork = APPROVED_NETWORK_ID == web3.networkId;

      if (this.web3.isInjected && this.web3.isConnectedToApprovedNetwork && this.web3.coinbase) {
        this.web3.isDAppReady = true;
      }
      // this.subscribeLogEvent(OMarketContract, 'AdminAdded')
      // this.subscribeLogEvent(OMarketContract, 'AdminRemoved')
      await this.getUserBasics();
    } catch (error) {
      this.web3.error = error;
      console.error(error, 'Unable to register web3 instance')
    }
  },
  methods: {
    contractSendWithInstance: async function(instance, method, ...args) {
      //FIXME: Wait calling methods until web3 is ready
      const cData = { args, method, action: 'send', success:false }
      this.consoleData.push(cData);
      try {
        const result = await instance[method](...args).send({from: this.web3.coinbase});
        cData.result = result;
        cData.success = true;
        return result;
      } catch(err) {
        cData.err = err;
        cData.success = false;
        //FIXME: Throw error to show something is wrong to the user
        return null;
      }
    },
    contractCallWithInstance: async function(instance, method, ...args) {
      //FIXME: Wait calling methods until web3 is ready
      const cData = { args, method, action: 'call', success:false }
      this.consoleData.push(cData);
      try {
        const result = await instance[method](...args).call();
        cData.result = result;
        cData.success = true;
        return result;
      } catch(err) {
        cData.err = err;
        cData.success = false;
        //FIXME: Throw error to show something is wrong to the user
        return null;
      }
    },
    contractCall: async function(method, ...args) {
      return this.contractCallWithInstance(this.oMarket, method, ...args);
    },
    contractSend: async function(method, ...args) {
      return this.contractSendWithInstance(this.oMarket, method, ...args);
    },
    getStoreContract: function (addr) {
      return new this.web3.handle.eth.Contract(
        StoreContract.abi,
        addr,
      ).methods;
    },
    storeCall: async function(addr, method, ...args) {
      const instance = this.getStoreContract(addr);
      return this.contractCallWithInstance(instance, method, ...args);
    },
    storeSend: async function(addr, method, ...args) {
      const instance = this.getStoreContract(addr);
      return this.contractSendWithInstance(instance, method, ...args);
    },
    contractSubscribe: async function(eventName, callback) {
      //FIXME: Connect web3 via websocket api
      //TODO: Research how metamask ws provider
      this.web3.subscribe(eventName, async (error, event) => {
        if (error) {
          console.error(`Error occured on event ${eventName}; ${error}`);
          return;
        }
        callback(eventName, event);
      });
    },
    getUserBasics: async function() {
      try {
        const owner = await this.contractCall('owner');
        const isOwner = owner === this.web3.accounts[0];
        const isAdmin = await this.contractCall('isAdmin');
        const isStoreOwner = await this.contractCall('isStoreOwner');
        this.user = { isOwner, isAdmin, isStoreOwner };
      } catch(error) {
        console.error(error);
      }
    },
    getAddressIcon(address) {
      return blockie(address);
    },
    ipfsAddress(hash) {
      return `https://gateway.ipfs.io/ipfs/${hash}`;
    }
  },
  template: '<App/>',
})
