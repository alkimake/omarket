<template>
  <div>
    <h1>{{ store.name }}</h1>
    <el-row :gutter="20">
      <el-col :span="18">
        <h2>Products</h2>
      </el-col>
      <el-col :span="6">
        <h2>Add New Product</h2>
        <el-upload
          class="product-image-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleProductImageSuccess"
          :before-upload="beforeProductUpload"
        >
          <img
            v-if="form.imageUrl"
            :src="form.imageUrl"
            class="avatar"
          />
          <i
            v-else
            class="el-icon-plus product-image-uploader-icon"
          ></i>
        </el-upload>
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
        >
          <el-form-item label="Name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="Price">
            <el-input-number
              v-model="form.price"
              :min="1"
            ></el-input-number> wei
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
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    store: Object
  },
  data() {
    return {
      form: {
        name: "",
        desc: "",
        imageUrl: "",
        price: 1,
        totalStock: 1,
      },
    };
  },
  methods: {
    async onSubmit() {},
    handleProductImageSuccess(res, file) {
      this.form.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeProductUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error("Product picture must be JPG or PNG format!");
      }
      if (!isLt2M) {
        this.$message.error("Product picture size can not exceed 2MB!");
      }
      return (isJPG || isPNG) && isLt2M;
    }
  }
};
</script>
<style>
  .product-image-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .product-image-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .product-image-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 340px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 100%;
    height: 178px;
    display: block;
  }
</style>
