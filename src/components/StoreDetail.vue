<template>
  <div>
    <h1>{{ store.name }}</h1>
    <el-row :gutter="20">
      <el-col :span="18">
        <h2>Products</h2>
        <el-table
          :data="productList"
          style="width: 100%"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <p>Description: {{ scope.row.desc }}</p>
              <p>Available: {{ scope.row.available }}</p>
              <p>Price: {{ scope.row.price }} wei</p>
              <p>Avalable Stock: {{ scope.row.stock }}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="Name"
            prop="name"
          >
          </el-table-column>
          <el-table-column
            label="Price"
          >
            <template slot-scope="scope">
              {{ scope.row.price }} wei
            </template>
          </el-table-column>
          <el-table-column
            label=""
            width="64"
          >
            <template slot-scope="scope">
              <el-image
                style="width: 48px; height: 48px"
                :src="$root.ipfsAddress(scope.row.imageHash)"
                fit="fill"
              >
              </el-image>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="6">
        <add-product :store="store"></add-product>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import AddProduct from './AddProduct.vue';
export default {
  components: {
    AddProduct,
  },
  props: {
    store: Object
  },
  data() {
    return {
      productList: [],
    };
  },
  watch: {
    $props: {
      handler() {
        this.productList = [];
        this.refreshList();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async refreshList() {
      const list = [];
      const lastId = await this.$root.storeCall(this.store.addr, 'idGenerator');
      console.log('id', lastId);
      for(let i = 0; i < lastId; i++) {
        const item = await this.$root.storeCall(this.store.addr, 'readProduct', i);
        list[i] = {
          name: item['0'],
          desc: item['1'],
          imageHash: item['2'],
          stock: parseInt(item['3']),
          available: item['4'],
          price: parseInt(item['5'])
        }
      }
      this.productList = list;
    }
  }
};
</script>
<style>
</style>
