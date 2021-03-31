<template>
  <el-pagination
    :style="{ 'text-align': textAlign }"
    class="pagination"
    :background="background"
    :current-page.sync="currentPage"
    :page-size.sync="pageSize"
    :layout="layout"
    :page-sizes="pageSizes"
    :total="total"
    :hide-on-single-page="hideOnSinglePage"
    v-bind="$attrs"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

const TEXT_ALIGN = ['left', 'center', 'right']

export default {
  name: 'QzPagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default () {
        return [15, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hideOnSinglePage: {
      type: Boolean,
      default: true
    },
    textAlign: {
      type: String,
      default: 'right',
      validator: value => {
        return TEXT_ALIGN.includes(value)
      }
    }
  },
  computed: {
    currentPage: {
      get () {
        return this.page
      },
      set (value) {
        this.$emit('update:page', value)
      }
    },
    pageSize: {
      get () {
        return this.limit
      },
      set (value) {
        this.$emit('update:limit', value)
      }
    }
  },
  methods: {
    handleSizeChange (value) {
      this.$emit('pagination', { page: this.currentPage, limit: value })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange (value) {
      this.$emit('pagination', { page: value, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  padding: 18px 0;
  background-color: #fff;
}
</style>
