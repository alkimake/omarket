<template>
  <div>
    Select a Store Owner to see their products
    <el-select
      v-model="selectedOwner"
      :loading="storesLoading"
      placeholder="Select"
    >
      <el-option
        v-for="item in storeOwnerList"
        :key="item.addr"
        :label="item.name"
        :value="item.addr"
        @change="getStoreList"
      >
      </el-option>
    </el-select>
    <el-divider></el-divider>
    <el-row :gutter="20">
      <el-col
        v-for="(o) in products"
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
              <p class="stock">
                Available: {{ o.stock }}
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>


<style>
.item {
  margin-bottom: 20px;
}
.desc {
  font-size: 13px;
  color: #999;
}
.stock {
  font-size: 13px;
  color: #993;
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
      stores: [],
      products: [],
      storesLoading: false,
      storeOwnerList: [],
      selectedOwner: "",
    };
  },
  watch: {
    selectedOwner: function (owner) {
      this.getStoreList(owner)
    }
  },
  mounted() {
    this.getStoreOwners();
  },
  methods: {
    async getStoreOwners() {
      this.storesLoading = true;
      const list = await this.$root.contractCall('getStoreOwners');
      this.storeOwnerList = await Promise.all(list.map(async addr => {
        const result = await this.$root.contractCall('readStoreOwner', addr);
        const owner = { addr: result['0'], name: result['1'], isActive: result['2']};
        return owner;
      }));
      if (this.storeOwnerList.length > 0) {
        this.selectedOwner = this.storeOwnerList[0].addr;
      }
      this.storesLoading = false;
    },
    async getStoreList(owner) {
      console.log("getStoreList", owner);
      this.products = [];
      this.stores = await this.$root.contractCall('getStoresOfOwner', owner);
      console.log(this.stores);
      if (this.stores == null) {
        this.stores = [];
      }
      for (const store of this.stores) { this.getProducts(store); }
    },
    async getProducts(store) {
      console.log("getProducts", store);
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
      try {
        await this.$root.storeSendWithValue(product.store, 'buyProducts', product.price, product.id, 1);
        product.stock -= 1;
        this.$alert(`${product.name} is bought successfully. Store owner will be in contact with you`, 'Bought', { type: "success", confirmButtonText: 'OK' });
        // this.$notify({ title:"Buying Product", message:"Transaction is sent successfully", type: "success" });
      } catch (error) {
        this.$alert(`Failed with error message: ${error}`, 'Error', { type: "error", confirmButtonText: 'OK' });
        // this.$notify.error({ title:"Buying Product", message:`Failed with error message: ${error}` });
      }
    }
  }
};
</script>
