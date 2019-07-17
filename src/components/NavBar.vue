<template>
  <div>
    <el-button
      style="float: right;"
      type="primary"
      @click="dialogConsoleVisible = true"
    >
      Console
    </el-button>
    <div style="margin-right:100px;">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="0">
          Store
        </el-menu-item>
        <el-menu-item
          v-if="$root.user.isStoreOwner"
          index="1"
        >
          Store Owner
        </el-menu-item>
        <el-menu-item
          v-if="$root.user.isAdmin"
          index="2"
        >
          Admin
        </el-menu-item>
        <el-menu-item
          v-if="$root.user.isOwner"
          index="3"
        >
          Owner
        </el-menu-item>
      </el-menu>
    </div>
    <el-dialog
      title="Console"
      :visible.sync="dialogConsoleVisible"
    >
      <console></console>
    </el-dialog>
  </div>
</template>

<script>
import Console from './Console.vue';

export default {
  components: {
    Console,
  },
  data() {
    return {
      activeIndex: '0',
      dialogConsoleVisible: false,
    };
  },
  mounted() {
    this.activeIndex = this.$router.options.routes.findIndex(r => r.path === this.$router.currentRoute.path).toString();
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeIndex = key;
      this.$router.push(this.$router.options.routes[key].path)
      // console.log(this.$router.options.routes);
    },
  }
}
</script>
