<template>
  <div class="account-container">
    <el-form
      ref="adminForm"
      :rules="rules"
      :model="localUser"
      label-position="left"
      label-width="100px"
      class="container-left"
    >
      <el-form-item label="Name" prop="name">
        <el-input v-model.trim="localUser.name" style="width: 320px;" />
      </el-form-item>
      <el-form-item label="Mobile" prop="mobile">
        <el-input v-model.trim="localUser.mobile" style="width: 320px;" />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model.trim="localUser.email" style="width: 320px;" />
      </el-form-item>
      <el-form-item style="margin-top: 200px;">
        <el-button type="primary" style="width: 500px;" @click="submit">
          Update
        </el-button>
      </el-form-item>
    </el-form>

    <el-upload
      class="container-right"
      action="api/v1/uploadAvatar"
      :data="{ filePath: 'admin/avatar' }"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :on-success="handleAvatarSuccess"
    >
      <img
        v-if="localUser.avatar"
        :src="localUser.avatar"
        class="avatar"
        alt="admin's avatar"
      >
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
  </div>
</template>

<script>
import { validMobile } from '@/utils/validate'

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          mobile: '',
          email: '',
          avatar: ''
        }
      }
    }
  },
  data () {
    const validateMobile = (rule, value, callback) => {
      if (!validMobile(value)) {
        callback(new Error('Please enter the correct phone number'))
      } else {
        callback()
      }
    }
    return {
      localUser: { ...this.user }, // 创建本地副本
      rules: {
        name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
        mobile: [{ required: true, trigger: ['blur', 'change'], validator: validateMobile }],
        email: [
          { required: true, message: 'Email is required', trigger: 'blur' },
          { type: 'email', message: 'Please enter the correct email', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  watch: {
    user: {
      handler (newValue) {
        this.localUser = { ...newValue } // 当父组件传递的 user 发生变化时同步更新本地副本
      },
      deep: true
    }
  },
  methods: {
    submit () {
      this.$refs.adminForm.validate(valid => {
        console.log('localUser: ', this.localUser)
        if (valid) this.$emit('update', { ...this.localUser }) // 将本地副本传递给父组件
      })
    },
    beforeAvatarUpload (file) {
      const isIMG = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
      const isLt1M = file.size / 1024 / 1024 < 1

      if (!isIMG) this.$message.error('上传头像图片只能是 JPG/PNG/GIF 格式!')

      if (!isLt1M) this.$message.error('上传头像图片大小不能超过 1MB!')

      return isIMG && isLt1M
    },
    handleAvatarSuccess (res) {
      this.localUser.avatar = res.data.url // 更新本地副本的头像
    }
  }
}
</script>

<style lang="scss" scoped>
.account-container {
  display: flex;
  margin-bottom: 100px;

  .container-left {
    width: 500px;
  }

  .container-right {
    width: 200px;

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
</style>
