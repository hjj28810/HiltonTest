<template>
  <div>
    <el-container>
      <el-header>
        <router-link to style="float: left;">
          <el-button type="text" @click="$router.go(-1)" style="width: 60px;">＜返回</el-button>
        </router-link>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-input v-model="mobile" placeholder="手机号码" clearable></el-input>
        </el-row>
        <el-row :gutter="20">
          <el-button type="success" @click.native.prevent="handleLogin">Logon</el-button>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getGuest, addGuest } from "@/api/guest";
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
    handleLogin() {
      if (!checkPhone(this.mobile)) {
        this.$message.error("无效的手机号码！");
        return
      }
      getGuest(this.mobile).then(data => {
        if (data.guest) {
          localStorage.setItem('guest', this.mobile)
          this.$router.push({ name: "mainView" })
        } else {
          this.$confirm(`无此用户，是否注册新用户?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info",
          }).then(() => {
            var newGuest = { name: "来宾", id: this.mobile }
            addGuest(newGuest).then(() => {
              this.$message({
                message: "注册成功",
                type: "success",
              });
              localStorage.setItem('guest', this.mobile)
              this.$router.push({ name: "mainView" })
            })
          });
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
  margin-top: 15px;
}

.el-input {
  width: 200px;
}

.el-main {
  margin-top: 150px;
}
</style>
