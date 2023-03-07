var couchbase = require('couchbase')
const conf = require('../config/conf.json')
class Couchbase {

    cluster = {}
    async initAsync() {
        this.cluster = await couchbase.connect(conf.couchbase_conn.host, {
            username: conf.couchbase_conn.username,
            password: conf.couchbase_conn.password,
            configProfile: 'wanDevelopment',
        })
        console.log('couchbase initialized')
    }

    async bucketAsync(bucketName) {
        return this.cluster.bucket(bucketName)
    }

    async defaultCollectionAsync(bucketName) {
        var bucket = await this.bucketAsync(bucketName)
        return bucket.defaultCollection()
    }

    async getByIdAsync(bucketName, id) {
        var collection = await this.defaultCollectionAsync(bucketName)
        return (await collection.get(id)).content
    }

    async getListAsync(bucketName, whereSql, parameters) {
        return await this.cluster.query(`SELECT * FROM \`${bucketName}\` WHERE 1 = 1${whereSql};`, { parameters })
    }

    async existsAsync(bucketName, id) {
        var collection = await this.defaultCollectionAsync(bucketName)
        return (await collection.exists(id)).exists
    }

    async addAsync(bucketName, id, data, options) {
        var collection = await this.defaultCollectionAsync(bucketName)
        return await collection.insert(id, data, options)
    }

    async updateAsync(bucketName, id, data) {
        var collection = await this.defaultCollectionAsync(bucketName)
        return await collection.replace(id, data)
    }
}

module.exports = new Couchbase()