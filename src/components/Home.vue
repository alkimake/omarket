<template>
  <div id="home" />
</template>

<script>
export default {
  name: 'Home',
  props: {
    currentView: {
      type: Object,
      default: null
    }
  }
}
</script>

<style scoped>
  #home {
    width: 100%;
  }
</style>
