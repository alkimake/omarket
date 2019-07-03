<template>
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
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '0'
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
    }
  }
}
</script>
