<template>
  <el-container class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </el-container>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key () {
      return this.$route.path
    }
  }
}
</script>

<style lang='scss' scoped>
.app-main {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 50px);
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}
</style>
