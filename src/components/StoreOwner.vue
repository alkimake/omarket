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
    }
  },
  methods: {
    async addNewStore() {
      console.log(this.newStoreForm.name, this.newStoreForm.labels.join(','));
    }
  }
}
</script>
<style scoped>

</style>
