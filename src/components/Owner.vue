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
          @click="onSubmit"
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
        label="Address"
      >
        <template slot-scope="scope">
          <i class="el-icon-star-on"></i>
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
            @click="handleDelete(scope.$index, scope.row)"
          >
            Delete
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
      adminList: []
    }
  },
  mounted: function() {
    this.refreshList();
  },
  methods: {
    async refreshList() {
      this.adminList = await this.$root.contractCall('getAdmins');
    },
    async handleDelete(index, address) {
      await this.$root.contractSend('removeAdmin', address);
      this.refreshList();
    },
    async onSubmit() {
      //TODO: Validate address
      await this.$root.contractSend('addAdmin', this.adminForm.address);
      this.refreshList();
    }
  }
}
</script>
<style>

</style>
