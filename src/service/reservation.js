const e = require('express');
const { v4: uuidv4 } = require('uuid');
const couchbase = require('../storage/couchbase')

const bucketName = "reservation"

class ReservationService {
    async getReservation(id) {
        return { code: 200, msg: "查询成功", data: await couchbase.getByIdAsync(bucketName, id) }
    }

    async getReservations(data) {
        var whereSql = ""
        var parameters = {}
        if (data.guest_contact) {
            whereSql += " AND guest_contact = $guestContact"
            parameters.guestContact = data.guest_contact
        }
        var result = await couchbase.getListAsync(bucketName, whereSql, parameters)
        return { code: 200, msg: "查询成功", data: result.rows.map(x => { return { ...x.reservation } }) }
    }

    async addReservation(data) {
        data.reservation_id = uuidv4()
        data.reservation_status = 0
        await couchbase.addAsync(bucketName, data.reservation_id, data)
        return { code: 200, msg: "新增成功", data: data.reservation_id }
    }

    async updateReservation(data) {
        var resp = await this.getReservation(data.reservation_id)
        if (resp.code !== 200) {
            return resp
        }
        var reservation = resp.data
        reservation.guest_name = data.guest_name
        reservation.guest_contact = data.guest_contact
        reservation.tabe_size = data.tabe_size
        reservation.expected_arrival_time = data.expected_arrival_time
        reservation.reservation_status = data.reservation_status
        reservation.remark = data.remark
        await couchbase.updateAsync(bucketName, data.reservation_id, reservation)
        return { code: 200, msg: "修改成功", data: data.reservation_id }
    }
}

module.exports = new ReservationService()