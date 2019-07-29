<template>
  <el-row :gutter="20">
    <el-col
      :span="12"
      :offset="6"
    >
      <div class="grid-content">
        <el-alert
          v-if="hasInjectedWeb3"
          type="success"
          show-icon
          :closable="false"
        >
          Your browser is Web3-injected.
        </el-alert>
        <div v-else>
          To use the eth-vue dApp, you can begin by installing a Web3 injector like <a href="https://metamask.io/">Metamask</a>.
          <div
            class="metamask-resource"
            @click="goToMetamask"
          >
          </div>
        </div>
        <el-alert
          v-if="hasInjectedWeb3 && isConnectedToApprovedNetwork"
          type="success"
          show-icon
          :closable="false"
        >
          Connected to the {{ connectedNetworkName }}.
        </el-alert>
        <el-alert
          v-if="hasInjectedWeb3 && !isConnectedToApprovedNetwork"
          type="error"
          show-icon
          :closable="false"
        >
          But you are not connected to our network on the blockchain [{{ connectedNetworkName }}].<br>
          Connect to the <b>{{ approvedNetworkName }}</b>.
        </el-alert>
        <el-alert
          v-if="hasInjectedWeb3 && isConnectedToApprovedNetwork && coinbase"
          type="success"
          show-icon
          :closable="false"
        >
          And we can see your ethereum address [{{ coinbase }}].
        </el-alert>
        <el-alert
          v-if="hasInjectedWeb3 && isConnectedToApprovedNetwork && !coinbase"
          type="error"
          show-icon
          :closable="false"
        >
          But it seems you don't have an account with us on the blockchain.<br>
          Or you do but the account is currently inaccessible.
          <br>Make your existing account accessible
        </el-alert>
      </div>
    </el-col>
  </el-row>
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
      return this.$root.web3.isConnectedToApprovedNetwork
    },
    approvedNetworkName () {
      const networkId = this.$root.web3.approvedNetworkId
      return NETWORKS[networkId]
    },
    connectedNetworkName () {
      const networkId = this.$root.web3.networkId
      return NETWORKS[networkId]
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
  .metamask-resource {
    background: url('../static/images/metamask.png') no-repeat;
    background-size: contain;
    height: 200px;
    width: auto;
    cursor: pointer;
  }
  .el-alert {
    margin: 2px;
  }
  #contents {
    margin: auto;
  }
</style>
