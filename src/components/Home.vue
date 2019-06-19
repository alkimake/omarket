<template>
  <div id="web3-message">
    <div class="content">
      <div class="message">
        <div v-if="hasInjectedWeb3">
          Your browser is Web3-injected.
          <br>
          <div v-if="isConnectedToApprovedNetwork">
            You are also connected to the {{ approvedNetworkName }} on the blockchain.
            <br>
            <div v-if="coinbase">
              And we can see your ethereum address [{{ coinbase }}].<br>
            </div>
            <div v-else>
              But it seems you don't have an account with us on the blockchain.<br>Or you do but the account is currently inaccessible.<br>Create an account on the blockchain and sign up to begin, or make your existing account accessible.
            </div>
          </div>
          <div v-else>
            But you are not connected to our network on the blockchain [{{ approvedNetworkName }}].<br>
            Connect to the {{ approvedNetworkName }}.
          </div>
        </div>
        <div v-else>
          To use the eth-vue dApp, you can begin by installing a Web3 injector like <a href="https://metamask.io/">Metamask</a>.
          <div
            class="metamask-resource"
            @click="goToMetamask"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { APPROVED_NETWORK_ID, NETWORKS } from '../util/constants'

export default {
  name: 'Home',
  computed: {
    hasInjectedWeb3() {
      return this.$root.web3.isInjected;
    },
    coinbase () {
      return this.$root.web3.coinbase
    },
    isConnectedToApprovedNetwork () {
      const networkId = this.$root.web3.networkId
      return APPROVED_NETWORK_ID == networkId;
    },
    approvedNetworkName () {
      const networkId = this.$root.web3.networkId
      const approvedNetworkId = APPROVED_NETWORK_ID || networkId
      return NETWORKS[approvedNetworkId]
    },
    web3Error() {
      return this.$root.web3.error;
    },
  },
  methods: {
    goToMetamask () {
      window.location.href = 'https://metamask.io/'
    }
  }
}
</script>

<style scoped>
  #web3-message {
    width: 100%;
    height: 420px;
  }
  .blockchain-message {
    float: left;
    margin-top: 20px;
    font-size: 14px;
    border: 1px solid #dcdede;
    color: #4d4c49;
    width: auto;
    padding: 10px;
  }
  .content {
    height: 100%;
    text-align: center;
    max-width: 920px;
    margin: auto;
    padding: 160px;
  }
  .message {
    height: 80px;
    line-height: 40px;
  }
  .metamask-resource {
    background: url('/static/images/metamask.png') no-repeat;
    background-size: contain;
    height: 200px;
    width: auto;
    cursor: pointer;
  }
</style>
