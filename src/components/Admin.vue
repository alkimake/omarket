<template>
  <div class="page-content">
    <el-form
      :inline="true"
      :model="storeOwnerForm"
    >
      <el-form-item label="StoreOwner Address">
        <el-input
          v-model="storeOwnerForm.address"
          placeholder="StoreOwner address"
        ></el-input>
      </el-form-item>
      <el-form-item label="StoreOwner Name">
        <el-input
          v-model="storeOwnerForm.name"
          placeholder="StoreOwner name"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="addStoreOwner"
        >
          Add Store Owner
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="storeOwnerList"
      style="width: 100%"
    >
      <el-table-column
        label=""
        width="64"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 48px; height: 48px"
            :src="$root.getAddressIcon(scope.row.addr)"
            fit="fill"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="Address"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.addr }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Name"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Active"
        width="120"
      >
        <template slot-scope="scope">
          <i :class="scope.row.isActive ? 'el-icon-success' : 'el-icon-warning'"></i>
        </template>
      </el-table-column>
      <el-table-column
        label="Operations"
        width="120"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            :type="scope.row.isActive ? 'danger' : 'primary'"
            icon="el-icon-remove-outline"
            @click="toggleStatus(scope.$index, scope.row.addr)"
          >
            {{ scope.row.isActive ? 'Disable' : 'Enable' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { delay } from '../util';
export default {
  data() {
    return {
      storeOwnerForm: {
        address: '',
        name: '',
      },
      storeOwnerList: [],
      loading: false,
    }
  },
  mounted: function() {
    this.refreshList();
  },
  methods: {
    async refreshList(wait=0, timeout=1000) {
      this.loading = true;
      if (wait) {
        await delay(timeout);
      }
      const list = await this.$root.contractCall('getStoreOwners');
      this.storeOwnerList = await Promise.all(list.map(async addr => {
        const result = await this.$root.contractCall('readStoreOwner', addr);
        const owner = { addr: result['0'], name: result['1'], isActive: result['2']};
        return owner;
      }));
      this.loading = false;
    },
    async toggleStatus(index, address) {
      try {
        await this.$root.contractSend('toggleStoreOwnerStatus', address);
        this.$notify({ title:"Toggle StoreOwner Status", message:"Transaction is sent successfully", type: "success" });
      } catch (error) {
        this.$notify.error({ title:"Add Store Owner", message:`Failed with error message: ${error}` });
      }
      this.refreshList(true);
    },
    async addStoreOwner() {
      //TODO: Validate address
      try {
        await this.$root.contractSend('addStoreOwner', this.storeOwnerForm.address, this.storeOwnerForm.name);
        this.$notify({ title:"Add Store Owner", message:"Transaction is sent to add new store owner", type: "success" });
      } catch (error) {
        this.$notify.error({ title:"Add Store Owner", message:`Failed with error message: ${error}` });
      }
      this.refreshList(true);
    }
  }
}
</script>
<style>

</style>
