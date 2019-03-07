<template>
  <div id="app">
    <img alt="Rakuten Rapid API Logo" src="./assets/rakuten_logo.svg" style="height: 60px">
    <Search />
  </div>
</template>

<script>
  import Search from './components/Search.vue'

  export default {
    name: 'app',
    components: {
      Search
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
