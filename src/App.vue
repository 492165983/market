<template>
  <div id="app">
    <!-- <HelloWorld /> -->
    <!-- <Horizontal /> -->
    <router-view v-if="isRouterAlive"></router-view>
  </div>

</template>

<script>
// import HelloWorld from './components/HelloWorld'
// import Horizontal from './pages/horizontalHq'
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true,
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true
      });
    },
  },
  components: {
    // HelloWorld,
    // Horizontal
  },
  mounted () {
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
      window.addEventListener('hashchange', () => {
        let currentPath = window.location.hash.slice(1)
        if (this.$route.path !== currentPath) {
          this.$router.push(currentPath);// 主动更改路由界面
        }
      }, false);
    }
  }

}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}
</style>
