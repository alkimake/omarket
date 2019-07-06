<template>
  <div
    id="console"
  >
    <el-alert
      v-if="hasInjectedWeb3"
      type="success"
      show-icon
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
    >
      Connected to the {{ approvedNetworkName }}.
    </el-alert>
    <el-alert
      v-if="hasInjectedWeb3 && !isConnectedToApprovedNetwork"
      type="error"
      show-icon
    >
      But you are not connected to our network on the blockchain [{{ approvedNetworkName }}].<br>
      Connect to the <b>{{ approvedNetworkName }}</b>.
    </el-alert>
    <el-alert
      v-if="hasInjectedWeb3 && isConnectedToApprovedNetwork && coinbase"
      type="success"
      show-icon
    >
      And we can see your ethereum address [{{ coinbase }}].
    </el-alert>
    <el-alert
      v-if="hasInjectedWeb3 && isConnectedToApprovedNetwork && !coinbase"
      type="error"
      show-icon
    >
      But it seems you don't have an account with us on the blockchain.<br>
      Or you do but the account is currently inaccessible.
      <br>Make your existing account accessible
    </el-alert>
    <div
      v-if="hasInjectedWeb3 && isConnectedToApprovedNetwork && coinbase"
    >
      <el-alert
        v-for="item in consoleData"
        :key="item.uuid"
        :type="consoleDataType(item)"
      >
        <b>{{ item.action }}:</b> {{ item.method }}( {{ item.args }} )
        <p v-if="item.result">
          {{ item.result }}
        </p>
        <p v-if="item.err">
          {{ item.err.message }}
        </p>
      </el-alert>
    </div>
  </div>
</template>

<script>
import { APPROVED_NETWORK_ID, NETWORKS } from '../util/constants'

export default {
  name: 'Home',
  computed: {
    consoleData() {
      return this.$root.consoleData;
    },
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
    consoleDataType (item) {
      if (item.success) {
        return 'success';
      }
      if (item.error) {
        return 'error';
      }
      if (item.action === 'send') {
        return 'info';
      }
    },
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
</style>
