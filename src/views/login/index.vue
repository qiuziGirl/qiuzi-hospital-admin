<template>
  <el-container class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      label-position="left"
      class="login-form"
    >
      <div class="title-container">
        <h3 class="title">
          QiuZi Hospital
        </h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="loginForm.username"
          type="text"
          name="username"
          placeholder="Username"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          v-model="loginForm.password"
          :type="passwordType"
          name="password"
          placeholder="Password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-password" @click="showPassword">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button
        type="primary"
        :loading="loading"
        style="width: 100%; margin-bottom: 30px;"
        @click.native.prevent="handleLogin"
      >
        Login
      </el-button>
    </el-form>
  </el-container>
</template>

<script>
export default {
  name: 'Login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (value.trim().length < 2) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (value.trim().length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }

    return {
      loading: false,
      redirect: null,
      passwordType: 'password',
      loginForm: {
        username: '秋子',
        password: '123456'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      }
    }
  },
  watch: {
    $route: {
      handler (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPassword () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin () {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.loading = true

          try {
            await this.$store.dispatch('user/login', this.loginForm)
            this.$router.push({ path: this.redirect || '/' }).catch(() => { })
          } finally {
            this.loading = false
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.login-container {
  .el-input {
    display: inline-block;
    width: 85%;
    height: 47px;

    input {
      height: 47px;
      padding: 12px 5px 12px 15px;
      color: #fff;
      background-color: transparent;
      border: 0;
      border-radius: 0;
      appearance: none;
      caret-color: #fff;

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px #283443 inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .el-form-item {
    color: #454545;
    background: rgb(0 0 0 / 10%);
    border: 1px solid rgb(255 255 255 / 10%);
    border-radius: 5px;
  }
}
</style>

<style lang='scss' scoped>
.login-container {
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  background-color: #2d3a4b;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    display: inline-block;
    width: 30px;
    padding: 6px 5px 6px 15px;
    color: #889aa4;
    vertical-align: middle;
  }

  .title-container {
    position: relative;

    .title {
      margin: 0 auto 40px;
      font-size: 26px;
      font-weight: 700;
      color: #fff;
      text-align: center;
    }
  }

  .show-password {
    position: absolute;
    top: 7px;
    right: 10px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
}
</style>
