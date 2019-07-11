<template>
  <div class="page-content">
    <el-form
      :inline="true"
      :model="adminForm"
    >
      <el-form-item label="Admin address">
        <el-input
          v-model="adminForm.address"
          placeholder="Admin address"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="addAdmin"
        >
          Add Admin
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="adminList"
      style="width: 100%"
    >
      <el-table-column
        label=""
        width="64"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 48px; height: 48px"
            :src="$root.getAddressIcon(scope.row)"
            fit="fill"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="Address"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row }}</span>
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
            type="danger"
            icon="el-icon-remove-outline"
            :disabled="isRemoving(scope.row)"
            @click="removeAdmin(scope.$index, scope.row)"
          >
            Remove
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      adminForm: {
        address: ''
      },
      adminList_: [],
      removingList: []
    }
  },
  computed: {
    adminList() {
      return this.adminList_;
    }
  },
  mounted: function() {
    this.refreshList();
  },
  methods: {
    async refreshList() {
      this.adminList_ = await this.$root.contractCall('getAdmins');
    },
    async removeAdmin(index, address) {
      this.removingList.push(address);
      await this.$root.contractSend('removeAdmin', address);
      this.refreshList();
    },
    async addAdmin() {
      //TODO: Validate address
      await this.$root.contractSend('addAdmin', this.adminForm.address);
      this.refreshList();
    },
    isRemoving(address) {
      const removingIndex = this.removingList.findIndex(a => address===a);
      return removingIndex != -1;
    }
  }
}
</script>
<style>

</style>
