<template>
  <el-container class="app-container">
    <el-header class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="Name"
        clearable
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.role"
        placeholder="Role"
        clearable
        style="width: 100px;"
        class="filter-item"
      >
        <el-option
          v-for="item in roleOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-button
        class="filter-item"
        style="margin-left: 15px;"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        Search
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleAdd"
      >
        Add
      </el-button>
    </el-header>

    <el-main>
      <el-table
        v-loading="listLoading"
        :data="adminList"
        border
        fit
        highlight-current-row
      >
        <el-table-column
          label="ID"
          align="center"
          type="index"
          width="70"
        />
        <el-table-column label="Name" align="center" min-width="80">
          <template v-slot="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Role" align="center" min-width="80">
          <template v-slot="{ row }">
            <span>{{ row.role }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Last LoginTime" align="center" min-width="80">
          <template v-slot="{ row }">
            <span>{{ row.lastLoginTime | formatTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Actions" align="center" width="250">
          <template v-slot="{ row, $index }">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              Edit
            </el-button>
            <el-button type="danger" size="mini" @click="handleDelete(row, $index)">
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <qz-pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getAccountList"
      />
    </el-main>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="620px"
      class="dialog-container"
    >
      <el-form
        ref="adminForm"
        v-loading="dialogLoading"
        :rules="rules"
        :model="tempAdmin"
        label-position="left"
        label-width="70px"
        class="body-left"
      >
        <el-form-item label="Role" prop="role">
          <el-select v-model="tempAdmin.role" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in roleOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="tempAdmin.name" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="Mobile">
          <el-input v-model="tempAdmin.mobile" style="width: 220px;" />
        </el-form-item>
      </el-form>

      <el-upload
        class="body-right"
        action="api/v1/uploadAvatar"
        :data="{ filePath: 'admin/avatar' }"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
        :on-success="handleAvatarSuccess"
      >
        <img
          v-if="tempAdmin.avatar"
          :src="tempAdmin.avatar"
          class="avatar"
          alt="admin's avatar"
        >
        <i v-else class="el-icon-plus avatar-uploader-icon" />
      </el-upload>
      <div slot="footer" style="margin-top: 130px;">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='add' ? addAdmin() : updateAdmin()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  name: 'AccountList',
  filters: {
    formatTime (time) {
      if (time) {
        return $dayjs(time).format('YYYY-MM-DD HH:mm:ss')
      }
      return 'No Login Logs'
    }
  },
  data () {
    return {
      adminList: [],
      total: 0,
      listLoading: false,
      dialogLoading: false,
      listQuery: {
        page: 1,
        limit: 15,
        name: '',
        role: ''
      },
      roleOptions: ['editor', 'admin'],
      tempAdmin: {
        id: '',
        name: '',
        role: '',
        mobile: '',
        avatar: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        add: 'Add',
        update: 'Edit'
      },
      rules: {
        role: [{ required: true, message: 'role is required', trigger: 'change' }],
        name: [{ required: true, message: 'name is required', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getAccountList()
  },
  methods: {
    async getAccountList () {
      this.listLoading = true

      try {
        const { total, admins } = await $api.account.getAdminList(this.listQuery)
        this.total = total
        this.adminList = admins
      } finally {
        this.listLoading = false
      }
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getAccountList()
    },
    resetTemp () {
      this.tempAdmin = {
        id: '',
        name: '',
        role: '',
        mobile: '',
        avatar: ''
      }
    },
    handleAdd () {
      this.resetTemp()
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.adminForm.clearValidate()
      })
    },
    addAdmin () {
      this.$refs.adminForm.validate(async valid => {
        if (valid) {
          this.dialogLoading = true
          const { name, role, mobile, avatar } = this.tempAdmin

          try {
            await $api.account.addAdmin({ name, role, mobile, avatar })

            this.adminList.push(this.tempAdmin)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Add Successfully',
              type: 'success',
              duration: 2000
            })
          } finally {
            this.dialogLoading = false
          }
        }
      })
    },
    handleUpdate (row) {
      this.tempAdmin = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.adminForm.clearValidate()
      })
    },
    updateAdmin () {
      this.$refs.adminForm.validate(async valid => {
        if (valid) {
          this.dialogLoading = true
          const { id, name, role, mobile, avatar } = this.tempAdmin

          try {
            await $api.account.updateAdmin(id, { name, role, mobile, avatar })

            const index = this.adminList.findIndex(admin => admin.id === this.tempAdmin.id)
            this.adminList.splice(index, 1, this.tempAdmin)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          } finally {
            this.dialogLoading = false
          }
        }
      })
    },
    handleDelete (row, index) {
      this.$confirm('The admin will be deleted forever, are you sure?', 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        await $api.account.deleteAdmin(row.id)

        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.adminList.splice(index, 1)
      })
    },
    beforeAvatarUpload (file) {
      const isIMG = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
      const isLt1M = file.size / 1024 / 1024 < 1

      if (!isIMG) {
        this.$message.error('上传头像图片只能是 JPG/PNG/GIF 格式!')
      }
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
      }

      return isIMG && isLt1M
    },
    handleAvatarSuccess (res) {
      this.tempAdmin.avatar = res.data.url
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container {
  /deep/ .el-dialog__body {
    display: flex;
    justify-content: space-between;
    padding: 30px 50px;

    .body-left {
      width: 300px;
    }

    .body-right {
      .avatar {
        width: 178px;
        height: 178px;
      }

      .avatar-uploader-icon {
        width: 178px;
        height: 178px;
        font-size: 28px;
        line-height: 178px;
        color: #8c939d;
        text-align: center;
        border: 1px dashed #d9d9d9;
      }
    }
  }
}
</style>
