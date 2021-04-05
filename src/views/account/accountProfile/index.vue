<template>
  <section class="app-container">
    <el-row :gutter="20">
      <el-col
        :xs="24"
        :sm="6"
        :md="6"
        :lg="6"
      >
        <user-card :user="user" />
      </el-col>

      <el-col
        :xs="24"
        :sm="18"
        :md="18"
        :lg="18"
      >
        <el-card v-loading="loading">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="Activity" name="activity">
              <activity />
            </el-tab-pane>
            <el-tab-pane label="Timeline" name="timeline">
              <timeline />
            </el-tab-pane>
            <el-tab-pane label="Account" name="account">
              <account :user="user" @update="updateAdmin" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'
import UserCard from './components/UserCard'

export default {
  name: 'AccountProfile',
  components: { UserCard, Activity, Timeline, Account },
  data () {
    return {
      loading: false,
      user: {
        id: null,
        name: '',
        role: '',
        email: '',
        avatar: ''
      },
      activeTab: 'activity'
    }
  },
  computed: {
    ...mapGetters(['id'])
  },
  created () {
    this.getUser()
  },
  methods: {
    async getUser () {
      this.loading = true

      try {
        this.user = await $api.account.getAdmin(this.id)
      } finally {
        this.loading = false
      }
    },
    async updateAdmin () {
      this.loading = true
      const { id, name, mobile, email, avatar } = this.user

      try {
        await $api.account.updateAdmin(id, { name, mobile, email, avatar })

        this.getUser()
        this.$notify({
          title: 'Success',
          message: 'Update Successfully',
          type: 'success',
          duration: 2000
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
