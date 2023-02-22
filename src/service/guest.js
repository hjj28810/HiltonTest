const { v4: uuidv4 } = require('uuid');
const couchbase = require('../storage/couchbase')

const bucketName = "guest"

class GuestService {
    async getGuestAsync(id) {
        return await couchbase.getByIdAsync(bucketName, id)
    }

    async addGuestAsync(data) {
        if (!await couchbase.existsAsync(bucketName, data.id)) {
            await couchbase.addAsync(bucketName, data.id, data)
        }
        return data.id
    }

    // async getGuestsAsync(data) {
    //     var whereSql = ""
    //     var parameters = {}
    //     if (data.id) {
    //         whereSql += " AND \`id\` = $Id"
    //         parameters.Id = data.id
    //     }
    //     var result = await couchbase.getListAsync(bucketName, whereSql, parameters)
    //     return result.rows.map(x => { return { ...x.guest } })
    // }
}

module.exports = new GuestService()