<template>
    <div>
        <el-row>
            <el-col :span="6">
                <router-link to style="float: left;margin-left: 10px;">
                    <el-button type="text" @click="$router.back(-1)">＜退出</el-button>
                </router-link>
            </el-col>
            <el-col :span="12">
                <el-tag style="margin-top: 5px;" :type="guestId === 'Employee' ? 'success' : ''"> {{ guestId
                }}</el-tag>
            </el-col>
            <el-col :span="6">
                <router-link to style="float: right;margin-right: 15px;">
                    <el-button type="text">新增</el-button>
                </router-link>
            </el-col>
        </el-row>
        <el-tabs v-model="activeName" v-loading="isLoaded" style="margin-left: 15px;margin-right: 15px;"
            @tab-click="handleTabClick">
            <el-tab-pane label="预定日历" name="calendar">
                <el-calendar v-model="dataValue">
                    <div slot="dateCell" slot-scope="{date, data}" @click="handleDateClick(data)">
                        <p>
                            {{ data.day.split('-')[2] }}<br />
                        </p>
                        <div style="display: flex;justify-content: flex-start;">
                            <div v-if="reservations && reservations.find(x => x.expectedArrivalDate === data.day && x.reservation_status === 'GuestReserved')"
                                class="blue budge">
                            </div>
                            <div v-if="reservations && reservations.find(x => x.expectedArrivalDate === data.day && x.reservation_status === 'GuestCancelled')"
                                class="grey budge">
                            </div>

                            <div v-if="reservations && reservations.find(x => x.expectedArrivalDate === data.day && x.reservation_status === 'EmpConfirmed')"
                                class="green budge">
                            </div>
                            <div v-if="reservations && reservations.find(x => x.expectedArrivalDate === data.day && x.reservation_status === 'EmpCancelled')"
                                class="red budge">
                            </div>
                        </div>
                    </div>
                </el-calendar></el-tab-pane>
            <el-tab-pane :label="tabName" name="all">
                <el-table :data="reservations" style="width: 100%">
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
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
import { getGuest } from "@/api/guest";
import { parseTime } from "@/utils/index";
import { getReservations } from "@/api/reservation";

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
                this.reservations = this.mapReservation(data.guest.reservations)
                this.isLoaded = false
            }
        })
    },
    data() {
        return {
            reservations: [],
            dataValue: new Date(),
            guestId: "",
            isLoaded: false,
            activeName: 'calendar',
            tabName: '所有预定'
        }
    },
    methods: {
        handleTabClick() {
            if (this.activeName === 'calendar') {
                this.tabName = '所有预定'
            }
            if (this.activeName === 'all') {
                this.getReservationList()
            }
        },
        handleDateClick(data) {
            this.tabName = data.day
            this.activeName = "all"
            var startTime = this.tabName + ' 00:00:00'
            var endTime = this.tabName + ' 23:59:59'
            this.getReservationList(startTime, endTime)
        },
        getReservationList(startTime, endTime) {
            this.isLoaded = true
            getReservations(this.guestId, startTime, endTime).then(data => {
                this.reservations = this.mapReservation(data)
                this.isLoaded = false
            })
        },
        mapReservation(data) {
            return data.map((item) => {
                item.expectedArrivalDate = parseTime(item.expected_arrival_time, '{y}-{m}-{d}')
                item.expectedArrivalTime = parseTime(item.expected_arrival_time)
                return { ...item };
            });
        }
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