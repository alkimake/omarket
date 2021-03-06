import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'

import OMarketContract from "./contracts/OMarket.json";
import StoreContract from "./contracts/Store.json";
import getWeb3 from './util/web3/getWeb3';
import { blockie } from './util/icon';

Vue.config.devtools = true
Vue.config.productionTip = false

Vue.use(ElementUI);

const APPROVED_NETWORK_ID = process.env.APPROVED_NETWORK_ID || '5777';

const connectToNetwork = async () => {
  const {web3, fallback} = await getWeb3({fallback: {type:'http', url:'http://127.0.0.1:8545'}});

  // Use web3 to get the user's accounts.
  const accounts = await web3.eth.getAccounts();
  const networkId = await web3.eth.net.getId();

  const coinbase = await web3.eth.getCoinbase();
  const hasInjectedWeb3 = await web3.eth.net.isListening();

  const deployedNetwork = OMarketContract.networks[networkId];
  let depAddr =  process.env.DEPLOYED_ADDRESS;
  if (!depAddr) {
    depAddr = deployedNetwork && deployedNetwork.address;
  }
  console.log("Deployed contract address is", depAddr);
  const instance = new web3.eth.Contract(
    OMarketContract.abi,
    depAddr,
  );
  return { web3: web3 ? web3 : fallback, accounts, networkId, coinbase, hasInjectedWeb3, instance };
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
      this.web3.approvedNetworkId = APPROVED_NETWORK_ID;
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
      const cData = { args, method, action: 'send', success:false }
      this.consoleData.push(cData);
      try {
        const result = await new Promise((resolve, reject) => instance[method](...args)
          .send({from: this.web3.coinbase})
          .once('transactionHash', resolve)
          .on('error', reject));
        cData.result = result;
        cData.success = true;
        return result;
      } catch(err) {
        cData.err = err;
        cData.success = false;
        throw err;
      }
    },
    contractCallWithInstance: async function(instance, method, ...args) {
      const cData = { args, method, action: 'call', success:false }
      this.consoleData.push(cData);
      try {
        const result = await instance[method](...args).call({from:this.web3.coinbase});
        cData.result = result;
        cData.success = true;
        return result;
      } catch(err) {
        cData.err = err;
        cData.success = false;
        throw err;
      }
    },
    contractSendValueWithInstance: async function(instance, method, value, ...args) {
      const cData = { args, method, action: 'send', success:false }
      this.consoleData.push(cData);
      try {
        const result = await new Promise((resolve, reject) => instance[method](...args)
          .send({from: this.web3.coinbase, value})
          .once('transactionHash', resolve)
          .on('error', reject));
        cData.result = result;
        cData.success = true;
        return result;
      } catch(err) {
        cData.err = err;
        cData.success = false;
        throw err;
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
    storeSendWithValue: async function(addr, method, value, ...args) {
      const instance = this.getStoreContract(addr);
      return this.contractSendValueWithInstance(instance, method, value, ...args);
    },
    contractSubscribe: async function(eventName, callback) {
      //FIXME: Connect web3 via websocket api
      //TODO: Research how metamask ws provider
    },
    getUserBasics: async function() {
      let isOwner = false;
      let isAdmin = false;
      let isStoreOwner = false;
      try {
        const owner = await this.contractCall('owner');
        isOwner = owner === this.web3.accounts[0];
        console.log("User isOwner", isOwner);
      } catch (error) {
        console.error(error);
      }
      try {
        isAdmin = await this.contractCall('isAdmin');
        console.log("User isAdmin", isAdmin);
      } catch (error) {
        console.error(error);
      }
      try {
        isStoreOwner = await this.contractCall('isStoreOwner');
        console.log("User isStoreOwner", isStoreOwner);
      } catch (error) {
        console.error(error);
      }
      this.user = { isOwner, isAdmin, isStoreOwner };
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
