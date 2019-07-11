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
      ref="storelistTable"
      :data="storeList"
      highlight-current-row
      style="width: 100%"
      @current-change="handleCurrentChange"
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
        prop="tag"
        label="Labels"
      >
        <template slot-scope="scope">
          <el-tag
            v-for="item in scope.row.labels"
            :key="item"
            disable-transitions
            style="margin-left:5px;"
          >
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <store-detail
      v-if="currentRow"
      :store="currentRow"
    ></store-detail>
  </div>
</template>
<script>
import StoreDetail from './StoreDetail.vue';
export default {
  components: {
    StoreDetail
  },
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
      currentRow: null,
    }
  },
  mounted: async function() {
    await this.refreshList();
    if (this.storeList.length > 0) {
      this.$refs.storelistTable.setCurrentRow(this.storeList[0]);
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    async refreshList() {
      const list = await this.$root.contractCall('getStores');
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
