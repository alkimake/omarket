<template>
  <el-row :gutter="20">
    <el-col
      v-for="(o, index) in products"
      :key="o.store+o.id"
      :xs="24"
      :sm="3"
      :lg="6"
    >
      <el-card
        shadow="always"
        class="item"
        :body-style="{ padding: '0px' }"
        :disabled="o.stock==0"
      >
        <div
          slot="header"
          class="clearfix"
        >
          <span>{{ o.name }}</span>
          <!-- <el-badge :value="o.stock" class="item"></el-badge> -->
          <el-button
            v-if="o.stock!=0"
            style="float: right;"
            type="primary"
            @click="buyItem(o)"
          >
            Buy
          </el-button>
          <el-button
            v-else
            style="float: right;"
            type="info"
            disabled
          >
            Out of Stock
          </el-button>
        </div>
        <el-image
          :src="$root.ipfsAddress(o.imageHash)"
          class="image"
          fit="cover"
        >
        </el-image>
        <div style="padding: 14px;">
          <div class="bottom clearfix">
            <p class="price">
              {{ ethPrice(o.price) }} Ξ
            </p>
            <p class="desc">
              {{ o.desc }}
            </p>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>


<style>
.item {
  margin-bottom: 20px;
}
.desc {
  font-size: 13px;
  color: #999;
}
.price {
  font-size: 13px;
  float: right;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  width: 100%
}

.image {
  width: 100%;
  display: block;
  height: 320px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>

<script>
import web3 from 'web3';
export default {
  data() {
    return {
      currentDate: new Date(),
      stores: {},
      products: [],
    };
  },
  mounted() {
    this.getStoreList();
  },
  methods: {
    async getStoreList() {
      this.products = [];
      this.stores = await this.$root.contractCall('getStores');
      for (const store of this.stores) { this.getProducts(store); }
    },
    async getProducts(store) {
      const list = [];
      const lastId = await this.$root.storeCall(store, 'idGenerator');
      for(let i = 0; i < lastId; i++) {
        const item = await this.$root.storeCall(store, 'readProduct', i);
        list[i] = {
          id: i,
          name: item['0'],
          desc: item['1'],
          imageHash: item['2'],
          stock: parseInt(item['3']),
          available: item['4'],
          price: parseInt(item['5']),
          store
        }
      }
      this.products.push(...list);
    },
    ethPrice(price) {
      return this.$root.web3.handle.utils.fromWei(price.toString())
    },
    async buyItem(product) {
      console.log(product.store, 'buyProducts', product.price, product.id, 1);
      await this.$root.storeSendWithValue(product.store, 'buyProducts', product.price, product.id, 1);
    }
  }
};
</script>
