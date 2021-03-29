<template>
  <div class="dashboard-container">
    <div class="dashboard-container__text">
      欢迎你， {{ name }} ！
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name'])
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 30px;

  &__text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
