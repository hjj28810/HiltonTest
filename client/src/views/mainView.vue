<template>
    <div>
        <el-row>
            <el-col :span="6">
                <router-link to style="float: left;margin-left: 10px;">
                    <el-button type="text" @click="handleLogout">＜退出</el-button>
                </router-link>
            </el-col>
            <el-col :span="12">
                <el-tag style="margin-top: 5px;" :type="guestId === 'Employee' ? 'success' : ''"> {{ guestId
                }}</el-tag>
            </el-col>
            <el-col :span="6">
                <router-link to style="float: right;margin-right: 15px;" v-show="guestId !== 'Employee'">
                    <el-button type="text" @click="handleAdd()">新增</el-button>
                </router-link>
            </el-col>
        </el-row>
        <el-tabs v-model="activeName" v-loading="isLoaded" style="margin-left: 15px;margin-right: 15px;margin-top: 10px;"
            stretch @tab-click="handleTabClick">
            <el-tab-pane label="预定日历" name="calendar">
                <el-calendar v-model="dataValue">
                    <div slot="dateCell" slot-scope="{date,data}" @click="handleDateClick(data)">
                        <p>
                            {{ data.day.split('-')[2] }}<br />
                        </p>
                        <div style="display: flex;justify-content: flex-start;">
                            <div v-if="allReservations && allReservations.find(x => x.expectedArrivalDate === data.day && x.reservation_status === 0)"
                                class="blue budge">
                            </div>
                            <div v-if="allReservations && allReservations.find(x => x.expectedArrivalDate === data.day && x.reservation_status === 1)"
                                class="grey budge">
                            </div>

                            <div v-if="allReservations && allReservations.find(x => x.expectedArrivalDate === data.day && x.reservation_status === 10)"
                                class="green budge">
                            </div>
                            <div v-if="allReservations && allReservations.find(x => x.expectedArrivalDate === data.day && x.reservation_status === 11)"
                                class="red budge">
                            </div>
                        </div>
                    </div>
                </el-calendar></el-tab-pane>
            <el-tab-pane :label="tabName" name="all">
                <el-table :data="reservations" style="width: 100%" @row-click="selectedReservation">
                    <el-table-column prop="expectedArrivalTime" width="180">
                        <template slot="header" slot-scope="scope">
                            <el-input v-model="search" size="mini" placeholder="到店时间" style="width: 130px;" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="guest_name" label="姓名" width="90">
                    </el-table-column>
                    <el-table-column prop="guest_contact" label="电话">
                    </el-table-column>
                    <el-table-column label="状态" width="90" align="center"
                        :filters="[{ text: '来宾预定', value: 0 }, { text: '来宾取消', value: 1 }, { text: '餐厅确认', value: 10 }, { text: '餐厅取消', value: 11 }]"
                        :filter-method="filterStatusHandler" filter-placement="bottom-end">
                        <template slot-scope="scope">
                            <el-tag :type="statusOptions.find(x => scope.row.reservation_status === x.key).tagTye">{{
                                statusOptions.find(x => scope.row.reservation_status === x.key).value
                            }}</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>

        <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible" width="400px">
            <el-form ref="dataForm" :rules="rules" status-icon :model="temp" label-position="right" label-width="80px"
                :disabled="formDisabled">
                <el-form-item label="来宾ID" prop="guest_id">
                    <el-input v-model.trim="temp.guest_id" placeholder="来宾ID" disabled
                        style="width: 200px;margin-left: -80px;" />
                </el-form-item>
                <el-form-item label="来宾姓名" prop="guest_name">
                    <el-input v-model.trim="temp.guest_name" clearable placeholder="来宾姓名"
                        style="width: 200px;margin-left: -80px;" />
                </el-form-item>
                <el-form-item label="联系方式" prop="guest_contact">
                    <el-input v-model.trim="temp.guest_contact" clearable placeholder="联系方式"
                        style="width: 200px;margin-left: -80px;" />
                </el-form-item>
                <el-form-item label="到店时间" prop="arrival_time">
                    <el-date-picker v-model="temp.arrival_time" type="datetime" placeholder="到店时间"
                        style="width: 200px;margin-left: -80px;" :picker-options="pickerOptions"
                        format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
                <el-form-item label="人数" prop="table_size">
                    <el-select v-model="temp.table_size" placeholder="人数" clearable
                        style="width: 150px;margin-right: 50px;margin-left: -80px;">
                        <el-option v-for="item1 in sizeOptions" :key="item1.key" :label="item1.value" :value="item1.key" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="reservation_status" v-if="dialogStatus === 'edit'">
                    <el-select v-model="temp.reservation_status" placeholder="状态" clearable
                        style="width: 150px;margin-right: 50px;margin-left: -80px;">
                        <el-option v-for="item1 in statusOptions" :key="item1.key" :label="item1.value"
                            :disabled="item1.disabled" :value="item1.key" />
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model.trim="temp.remark" clearable placeholder="备注" style="width: 200px;margin-left: -80px;"
                        :rows="4" type="textarea" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" :loading="btnLoading" v-if="!formDisabled"
                    @click="dialogStatus === 'create' ? createData() : updateData()">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getGuest } from "@/api/guest";
import { parseTime, checkContact } from "@/utils/index";
import { resetRouter } from "@/router/index";
import { getReservations, addReservation, updateReservation } from "@/api/reservation";
const statusOptions = [
    { key: 0, value: "来宾预订", tagTye: '', disabled: false },
    { key: 1, value: "来宾取消", tagTye: 'info', disabled: false },
    { key: 10, value: "餐厅确认", tagTye: 'success', disabled: false },
    { key: 11, value: "餐厅取消", tagTye: 'danger', disabled: false },
];
const sizeOptions = [
    { key: 0, value: "1-2人", },
    { key: 1, value: "2-4人", },
    { key: 2, value: "4-8人", },
    { key: 3, value: "8人以上", },
];
export default {
    name: "mainView",
    props: {

    },
    created() {
        this.handleInit()
    },
    watch: {
        search: {
            handler: function (val, oldVal) {
                this.reservations = this.reservationList.filter(x => { return x.expectedArrivalDate.includes(val) })
            },
            immediate: true,
        },
    },
    data() {
        return {
            statusOptions,
            sizeOptions,
            reservations: [],
            reservationList: [],
            allReservations: [],
            dataValue: new Date(),
            guestId: "",
            isLoaded: false,
            activeName: 'calendar',
            tabName: '所有预定',
            formDisabled: false,
            titleMap: {
                edit: "修改",
                create: "新增",
            },
            search: "",
            dialogStatus: "create",
            dialogFormVisible: false,
            btnLoading: false,
            temp: {
                guest_id: "",
                guest_name: "",
                guest_contact: "",
                arrival_time: "",
                table_size: undefined,
                reservation_status: undefined,
                remark: "",
            },
            pickerOptions: {
                shortcuts: [
                    {
                        text: "今天",
                        onClick(picker) {
                            picker.$emit("pick", new Date());
                        },
                    },
                    {
                        text: "昨天",
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit("pick", date);
                        },
                    },
                    {
                        text: "一周前",
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit("pick", date);
                        },
                    },
                ],
            },
            rules: {
                guest_contact: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: function (rule, value, callback) {
                            if (!checkContact(value)) {
                                callback(new Error("联系方式格式错误"));
                            } else {
                                callback();
                            }
                        },
                    },
                ],
                guest_id: [
                    {
                        required: true,
                        message: "来宾ID不能为空",
                        trigger: "blur",
                    },
                ],
                guest_name: [
                    {
                        required: true,
                        message: "来宾姓名不能为空",
                        trigger: "blur",
                    },
                ],
                arrival_time: [
                    {
                        required: true,
                        message: "到店时间不能为空",
                        trigger: ["blur", "change"],
                    },
                ],
                table_size: [
                    {
                        required: true,
                        message: "人数不能为空",
                        trigger: ["blur", "change"],
                    },
                ],
                reservation_status: [
                    {
                        required: true,
                        message: "状态不能为空",
                        trigger: ["blur", "change"],
                    },
                ],
                remark: [
                    {
                        required: false,
                    },
                ],
            },
        }
    },
    methods: {
        handleInit() {
            this.guestId = localStorage.getItem('guest')
            if (!this.guestId) {
                return
            }
            this.isLoaded = true
            if (this.guestId !== 'Employee') {
                this.statusOptions[0].disabled = false
                this.statusOptions[1].disabled = false
                this.statusOptions[2].disabled = true
                this.statusOptions[3].disabled = true
                getGuest(this.guestId).then(data => {
                    if (data.guest) {
                        this.allReservations = this.mapReservation(data.guest.reservations)
                        if (this.activeName === 'all') {
                            this.getReservationList()
                        }
                        this.isLoaded = false
                    }
                })
            } else {
                this.statusOptions[0].disabled = true
                this.statusOptions[1].disabled = true
                this.statusOptions[2].disabled = false
                this.statusOptions[3].disabled = false
                getReservations().then(data => {
                    if (data) {
                        this.allReservations = this.mapReservation(data)
                        if (this.activeName === 'all') {
                            this.getReservationList()
                        }
                        this.isLoaded = false
                    }
                })
            }
        },
        handleTabClick() {
            if (this.activeName === 'calendar') {
                this.tabName = '所有预定'
            }
            if (this.activeName === 'all') {
                this.isLoaded = true
                this.getReservationList()
                this.isLoaded = false
            }
        },
        handleAdd() {
            this.resetTemp()
            this.temp.guest_id = this.guestId
            this.dialogStatus = 'create'
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
            this.dialogFormVisible = true
        },
        handleLogout() {
            localStorage.clear()
            resetRouter()
            // this.$router.push({ path: "/" })
            this.$router.go(-1)
        },
        handleDateClick(data) {
            this.tabName = data.day
            this.activeName = "all"
            this.getReservationList()
        },
        getReservationList() {
            if (this.tabName !== "所有预定") {
                var startAt = new Date(this.tabName + ' 00:00:00').getTime() / 1000
                var endAt = new Date(this.tabName + ' 23:59:59').getTime() / 1000
                this.reservations = this.allReservations.filter(x => { return x.expected_arrival_time >= startAt && x.expected_arrival_time <= endAt })
                this.reservationList = this.reservations
            } else {
                this.reservations = this.allReservations
                this.reservationList = this.reservations
            }
        },
        mapReservation(data) {
            return data.map((item) => {
                item.expectedArrivalDate = parseTime(item.expected_arrival_time, '{y}-{m}-{d}')
                item.expectedArrivalTime = parseTime(item.expected_arrival_time)
                return { ...item };
            });
        },
        createData() {
            this.$refs["dataForm"].validate((valid) => {
                if (valid) {
                    this.$confirm(`是否新增预定?`, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "info",
                    }).then(() => {
                        this.btnLoading = true
                        this.temp.expected_arrival_time = this.temp.arrival_time.getTime() / 1000
                        addReservation(this.temp).then(() => {
                            this.$message({
                                message: "预定成功",
                                type: "success",
                            });
                            this.btnLoading = false
                            this.resetTemp()
                            this.dialogFormVisible = false
                            this.handleInit()
                        }).catch(() => {
                            this.btnLoading = false
                        })
                    });
                }
            });
        },
        updateData() {
            this.$refs["dataForm"].validate((valid) => {
                if (valid) {
                    this.$confirm(`是否修改预定?`, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "info",
                    }).then(() => {
                        this.btnLoading = true
                        this.temp.expected_arrival_time = this.temp.arrival_time.getTime() / 1000
                        updateReservation(this.temp).then(() => {
                            this.$message({
                                message: "修改成功",
                                type: "success",
                            });
                            this.btnLoading = false
                            this.resetTemp()
                            this.dialogFormVisible = false
                            this.handleInit()
                        }).catch(() => {
                            this.btnLoading = false
                        })
                    });
                }
            });
        },
        resetTemp() {
            this.temp = {
                guest_id: "",
                guest_name: "",
                guest_contact: "",
                arrival_time: "",
                table_size: undefined,
                reservation_status: 0,
                remark: "",
            };
        },
        selectedReservation(row) {
            this.dialogFormVisible = true
            this.dialogStatus = 'edit'
            this.temp.reservation_id = row.reservation_id;
            this.temp.guest_id = row.guest_id
            this.temp.guest_name = row.guest_name
            this.temp.guest_contact = row.guest_contact
            this.temp.table_size = row.table_size
            this.temp.remark = row.remark
            this.temp.arrival_time = new Date(row.expectedArrivalTime)
            this.temp.reservation_status = row.reservation_status
            if ((this.temp.reservation_status === 11 && this.guestId !== 'Employee') || (this.temp.reservation_status === 1 && this.guestId === 'Employee'))
                this.formDisabled = true
            else
                this.formDisabled = false
        },
        filterStatusHandler(value, row) {
            return row.reservation_status === value;
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