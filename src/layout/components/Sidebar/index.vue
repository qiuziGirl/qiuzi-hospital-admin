<template>
  <div :class="{ 'has-logo': showLogo }">
    <sidebar-logo v-if="showLogo" :collapse="isCollapse" />

    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBackgroundColor"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveTextColor"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route, index) in permission_routes"
          :key="index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarLogo from './components/SidebarLogo'
import SidebarItem from './components/SidebarItem'
import variables from '@/assets/style/variables.scss'

export default {
  name: 'Sidebar',
  components: {
    SidebarLogo,
    SidebarItem
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'permission_routes'
    ]),
    variables () {
      return variables
    },
    activeMenu () {
      const { meta, path } = this.$route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }

      return path
    },
    showLogo () {
      return this.$store.state.settings.sidebarLogo
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  }
}
</script>
