<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebar-logo-fade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">
          {{ title }}
        </h1>
      </router-link>
      <router-link
        v-else
        key="expand"
        class="sidebar-logo-link"
        to="/"
      >
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">
          {{ title }}
        </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      title: 'QiuZi Hospital Admin',
      logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar-logo-fade-enter-active {
  transition: opacity 1.5s;
}

.sidebar-logo-fade-enter,
.sidebar-logo-fade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  overflow: hidden;
  line-height: 50px;
  text-align: center;
  background: #2b2f3a;

  .sidebar-logo-link {
    width: 100%;
    height: 100%;

    .sidebar-logo {
      width: 32px;
      height: 32px;
      margin-right: 12px;
      vertical-align: middle;
    }

    .sidebar-title {
      display: inline-block;
      margin: 0;
      font-family: Avenir, "Helvetica Neue", Arial, Helvetica, sans-serif;
      font-size: 14px;
      font-weight: 600;
      line-height: 50px;
      color: #fff;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0;
    }
  }
}
</style>
