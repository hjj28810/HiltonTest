<template>
    <div>
        <el-row>
            <el-col :span="6">
                <router-link to style="float: left;margin-left: 15px;">
                    <el-button type="text" @click="$router.back(-1)">＜返回</el-button>
                </router-link>
            </el-col>
            <el-col :span="12">
                <el-tag style="margin-top: 5px;" type="success"> {{ guestId }}</el-tag>
            </el-col>
            <el-col :span="6">
                <router-link to style="float: right;margin-right: 15px;">
                    <el-button type="text" @click="$router.back(-1)">新增</el-button>
                </router-link>
            </el-col>
        </el-row>
        <el-table :data="reservations" style="width: 100%" v-loading="isLoaded">
            <el-table-column prop="expectedArrivalTime" label="到店时间" width="180">
            </el-table-column>
            <el-table-column prop="guest_name" label="姓名" width="70">
            </el-table-column>
            <el-table-column prop="guest_contact" label="电话">
            </el-table-column>
            <el-table-column label="状态" width="70" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.reservation_status === 'GuestReserved'">{{
                        "已预订"
                    }}</el-tag>
                    <el-tag type="info" v-if="scope.row.reservation_status === 'GuestCancelled'">{{
                        "已取消"
                    }}</el-tag>
                    <el-tag type="success" v-if="scope.row.reservation_status === 'EmpConfirmed'">{{
                        "已确认"
                    }}</el-tag>
                    <el-tag type="danger" v-if="scope.row.reservation_status === 'EmpCancelled'">{{
                        "被取消"
                    }}</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { getGuest } from "@/api/guest";
import { parseTime } from "@/utils/index";

export default {
    name: "mainView",
    props: {

    },
    created() {
        this.guestId = this.$route.params.guestId
        if (!this.guestId) {
            return
        }
        this.isLoaded = true
        getGuest(this.guestId).then(data => {
            if (data.guest) {
                this.reservations = data.guest.reservations.map((item) => {
                    item.expectedArrivalTime = parseTime(item.expected_arrival_time)
                    return { ...item };
                });
                this.isLoaded = false
            }
        })
    },
    data() {
        return {
            reservations: [],
            guestId: "",
            isLoaded: false
        }
    },
    methods: {

    }
};
</script>
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.budge {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    margin: 5px auto;
}

.red {
    background-color: #ee39d0;
}

.green {
    background-color: #39ee8a;
}

.blue {
    background-color: #4791ff;
}

.grey {
    background-color: #838485;
}
</style>