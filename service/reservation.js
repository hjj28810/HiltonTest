const couchbase = require('../storage/couchbase')


class ReservationService {
    async getReservation(id) {
        return await collection.get(1)
    }

    async addReservation(data) {
        var couchbaseCollection = await couchbase.initAsync()
        couchbaseCollection.upsert(1, data)
    }
}

module.exports = new ReservationService()