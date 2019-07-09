<template>
  <div class="page-content">
    <el-form
      :inline="true"
      :model="newStoreForm"
    >
      <el-form-item label="Store Name">
        <el-input
          v-model="newStoreForm.name"
          placeholder="Name"
        ></el-input>
      </el-form-item>
      <el-select
        v-model="newStoreForm.labels"
        multiple
        filterable
        allow-create
        default-first-option
        placeholder="Choose labels for your store"
      >
        <el-option
          v-for="item in newStoreForm.label.options"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="addNewStore"
        >
          Add New Store
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="storeList"
      style="width: 100%"
    >
      <el-table-column
        label="Address"
      >
        <template slot-scope="scope">
          <i class="el-icon-star-on"></i>
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
        prop="tag"
        label="Labels"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag
            v-for="item in scope.row.labels"
            :key="item"
            disable-transitions
          >
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      newStoreForm: {
        label: {
          options: [
            'Food',
            'Clothes',
            'Home',
            'Electronics'
          ]
        }
      },
      storeList: [],
    }
  },
  mounted: function() {
    this.refreshList();
  },
  methods: {
    async refreshList() {
      const list = await this.$root.contractCall('getStores');
      this.storeList = list.map(item => ({addr: item}));
      this.storeList = await Promise.all(list.map(async addr => {
        const info = await this.$root.storeCall(addr, 'getInfo');
        const store = { addr, name:info['0'], labels:info['1'] };
        return store;
      }));
    },
    async addNewStore() {
      await this.$root.contractSend('addNewStore', this.newStoreForm.name, this.newStoreForm.labels.join(','));
      this.refreshList();
    }
  }
}
</script>
<style scoped>

</style>
