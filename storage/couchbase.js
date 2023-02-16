var couchbase = require('couchbase')

const conf = require('../config/conf.json')
module.exports
    = {
    async initAsync() {
        var username = conf.couchbase_conn.username
        var password = conf.couchbase_conn.password
        var bucketName = 'reservation'

        const cluster = await couchbase.connect(conf.couchbase_conn.host, {
            username: username,
            password: password,
            // Sets a pre-configured profile called "wanDevelopment" to help avoid latency issues
            // when accessing Capella from a different Wide Area Network
            // or Availability Zone (e.g. your laptop).
            // configProfile: 'wanDevelopment',
        })

        const bucket = cluster.bucket(bucketName)
        return bucket.defaultCollection()
        // return bucket.scope('tenant_agent_00').collection(bucketName)
    }
}