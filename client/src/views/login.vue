<template>
  <div>
    <el-container>
      <el-main>
        <el-row :gutter="20">
          <el-input v-model="mobile" placeholder="手机号码" clearable></el-input>
        </el-row>
        <el-row :gutter="20">
          <el-button type="primary" @click.native.prevent="handleLogin">Guest Logon</el-button>
        </el-row>
        <el-row :gutter="20">

        </el-row>
        <el-row :gutter="20">
          <p>OR</p>
        </el-row>
        <el-row :gutter="20">
          <el-button type="success" @click.native.prevent="handleLogin('Employee')">Employee Logon</el-button>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { login } from "@/api/guest";
import { checkPhone } from "@/utils/index";

export default {
  name: "guestLogin",
  props: {

  },
  data() {
    return {
      mobile: ''
    }
  },
  methods: {
    handleLogin(type) {
      var id = this.mobile
      if (type) {
        id = 'Employee'
      } else {
        if (!checkPhone(id)) {
          this.$message.error("无效的手机号码！");
          return
        }
      }
      login(id).then(data => {
        console.log(data)
        if (data.token) {
          localStorage.setItem('user', id)
          localStorage.setItem('token', data.token)
          this.$router.push({ name: "mainView" })
        }
      })
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-button {
  width: 200px;
}

.el-input {
  width: 200px;
  margin-bottom: 15px;
}

.el-main {
  margin-top: 150px;
}
</style>
