<template>
  <div class="page-content">
    <el-form
      :inline="true"
      :model="storeOwnerForm"
    >
      <el-form-item label="StoreOwner address">
        <el-input
          v-model="storeOwnerForm.address"
          placeholder="StoreOwner address"
        ></el-input>
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
      :data="storeOwnerList"
      style="width: 100%"
    >
      <el-table-column
        label="Address"
      >
        <template slot-scope="scope">
          <i class="el-icon-star-on"></i>
          <span style="margin-left: 10px">{{ scope.row }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      storeOwnerForm: {
        address: '',
        name: '',
      },
      storeOwnerList: []
    }
  },
  mounted: function() {
    this.refreshList();
  },
  methods: {
    async refreshList() {
      this.storeOwnerList = await this.$root.contractCall('getStoreOwners');
    },
    async addStoreOwner() {
      //TODO: Validate address
      await this.$root.contractSend('addStoreOwner', this.storeOwnerForm.address, this.storeOwnerForm.name);
      this.refreshList();
    }
  }
}
</script>
<style>

</style>
