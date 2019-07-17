
<template>
  <div id="content">
    <Web3 v-if="!visible"></Web3>
    <div
      v-else
      id="main-page"
    >
      <NavBar></NavBar>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import NavBar from './components/NavBar';
import Web3 from './components/Web3'
export default {
  name: 'App',
  components: {
    NavBar,
    Web3,
  },
  computed: {
    visible: function () {
      return this.$root.web3.isDAppReady;
    },
  }
};
</script>

<style scoped>
  html {
    background: #eef0ef;
  }
  body {
    margin: 0;
    width: 100%;
  }
  * {
    box-sizing: border-box;
  }
  textarea {
    resize: none;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    width: 100%;
    /*max-width: 960px;*/
    min-width: 1020px;
    margin: auto;
  }
</style>
