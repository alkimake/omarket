<template>
  <div
    v-loading="loading"
    :element-loading-text="loadingText"
  >
    <h2>Add New Product to {{ store.name }}</h2>
    <el-form
      ref="form"
      :model="form"
      label-width="120px"
    >
      <el-form-item label="Picture">
        <input
          type="file"
          @change="handleAdd"
        ></input>
      </el-form-item>
      <el-form-item label="Name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="Price">
        <el-input-number
          v-model="form.price"
          :min="1"
        ></el-input-number> ether
      </el-form-item>
      <el-form-item label="Stock">
        <el-input-number
          v-model="form.totalStock"
          :min="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="Description">
        <el-input
          v-model="form.desc"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
        >
          Create
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { read } from 'fs';
import web3 from 'web3';
const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001,protocol: 'https' });

const LOADING_TEXT_UPLOAD = 'Uploading Image';
const LOADING_TEXT_PRODUCT = 'Creating New Product';
export default {
  props: {
    store: Object,
    productAddedCallback: Function,
  },
  data() {
    return {
      form: {
        name: "",
        desc: "",
        imageUrl: "",
        price: 1,
        totalStock: 1,
        file: '',
      },
      loading: false,
      loadingText: LOADING_TEXT_UPLOAD,
    };
  },
  computed: {
    ipfsImageUrl() {
      return `https://ipfs.infura.io:5001/api/v0/get?arg=${this.form.imageUrl}`;
    }
  },
  methods: {
    async onSubmit() {
      this.loadingText = LOADING_TEXT_PRODUCT;
      this.loading = true;
      try {
        await this.$root.storeSend(this.store.addr, 'addProduct', this.form.name, this.form.desc, this.form.imageUrl, this.form.totalStock, web3.utils.toWei(this.form.price.toString()));
        this.$notify({ title:"Add Product", message:"Transaction is sent to add new product", type: "success" });
      } catch (error) {
        this.$notify.error({ title:"Add Product", message:`Failed with error message: ${error}` });
      }
      this.loading = false;
      this.productAddedCallback();
    },
    async handleAdd(ev) {
      const file = ev.target.files[0];
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error("Product picture must be JPG or PNG format!");
        return;
      }
      if (!isLt2M) {
        this.$message.error("Product picture size can not exceed 2MB!");
        return;
      }
      this.loading = true;
      this.loadingText = LOADING_TEXT_UPLOAD;
      const reader = new FileReader(file);
      reader.onloadend = () => this.uploadImage(reader);
      reader.readAsArrayBuffer(file);

    },
    async uploadImage(reader) {
      // console.log(reader.result);
      const buffer = await Buffer.from(reader.result);
      // console.log(buffer);
      const ipfsHash = await ipfs.add(buffer);
      console.log(ipfsHash);
      this.form.imageUrl = ipfsHash[0].hash;
      this.loading = false;
    }
  }
};
</script>
<style>
</style>
