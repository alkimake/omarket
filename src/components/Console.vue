<template>
  <div>
    <el-button
      type="info"
      class="button"
      icon="el-icon-delete"
      @click="clearConsole"
    >
      Clear Logs
    </el-button>

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
</template>

<script>
import { APPROVED_NETWORK_ID, NETWORKS } from '../util/constants'
import { moveCursor } from 'readline';

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
    },
    clearConsole () {
      this.$root.consoleData = [];
    },
  },
}
</script>

<style scoped>
  .el-alert {
    margin: 2px;
  }
</style>
