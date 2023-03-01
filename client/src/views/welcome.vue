<template>
    <div>
        <el-container>
            <el-main>
                Choose Your Role
                <el-row :gutter="20">
                    <el-button type="primary" @click.native.prevent="handleGuestLogin">
                        Guest
                    </el-button>
                </el-row>
                <el-row :gutter="20">
                    <el-button type="success" @click.native.prevent="handleEmployeeLogin">Employee</el-button>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script>
export default {
    name: "welcome",
    props: {

    },
    methods: {
        handleGuestLogin() {
            this.$router.push('/guestLogin')
        },
        handleEmployeeLogin() {
            this.$router.push({ name: "mainView", params: { guestId: 'Employee' } })
        }
    }
};
</script>
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-button {
    width: 120px;
}

.el-row {
    margin-top: 15px;
}
</style>