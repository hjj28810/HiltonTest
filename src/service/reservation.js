const { v4: uuidv4 } = require('uuid');
const couchbase = require('../storage/couchbase')

const bucketName = "reservation"

class ReservationService {
    async getReservationAsync(id) {
        if (await couchbase.existsAsync(bucketName, id))
            return await couchbase.getByIdAsync(bucketName, id)
        else
            return null
    }

    async getReservationsAsync(data) {
        var whereSql = ""
        var parameters = {}
        if (data.guest_contact) {
            whereSql += " AND \`guest_contact\` = $guestContact"
            parameters.guestContact = data.guest_contact
        }
        if (data.guest_id) {
            whereSql += " AND \`guest_id\` = $guestId"
            parameters.guestId = data.guest_id
        }
        var result = await couchbase.getListAsync(bucketName, whereSql, parameters)
        return result.rows.map(x => { return { ...x.reservation } })
    }

    async addReservationAsync(data) {
        data.reservation_id = uuidv4()
        data.reservation_status = 0
        await couchbase.addAsync(bucketName, data.reservation_id, data)
        return data.reservation_id
    }

    async updateReservationAsync(data) {
        var reservation = await this.getReservation(data.reservation_id)
        if (reservation !== null) {
            reservation.guest_name = data.guest_name
            reservation.guest_contact = data.guest_contact
            reservation.tabe_size = data.tabe_size
            reservation.expected_arrival_time = data.expected_arrival_time
            reservation.reservation_status = data.reservation_status
            reservation.remark = data.remark
            await couchbase.updateAsync(bucketName, data.reservation_id, reservation)
            return data.reservation_id
        }
        return ""
    }
}

module.exports = new ReservationService()