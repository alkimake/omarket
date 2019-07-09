<template>
  <div>
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
    }
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
    }
  }
}
</script>

<style scoped>
  .el-alert {
    margin: 2px;
  }
</style>
