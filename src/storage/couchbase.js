var couchbase = require('couchbase')
const conf = require('../config/conf.json')

var _clusterAsync = async function () {
    return await couchbase.connect(conf.couchbase_conn.host, {
        username: conf.couchbase_conn.username,
        password: conf.couchbase_conn.password,
        // Sets a pre-configured profile called "wanDevelopment" to help avoid latency issues
        // when accessing Capella from a different Wide Area Network
        // or Availability Zone (e.g. your laptop).
        // configProfile: 'wanDevelopment',
    })
}

var _bucketAsync = async function (bucketName) {
    var cluster = await _clusterAsync()
    return cluster.bucket(bucketName)
}

var _defaultCollectionAsync = async function (bucketName) {
    var bucket = await _bucketAsync(bucketName)
    return bucket.defaultCollection()
    // return bucket.scope('tenant_agent_00').collection("")
}

var _getByIdAsync = async function (bucketName, id) {
    var collection = await _defaultCollectionAsync(bucketName)
    return (await collection.get(id)).content
}

var _getListAsync = async function (bucketName, whereSql, parameters) {
    var cluster = await _clusterAsync()
    return await cluster.query(`SELECT * FROM \`${bucketName}\` WHERE 1 = 1${whereSql};`, { parameters })
}

var _existsAsync = async function (bucketName, id) {
    var collection = await _defaultCollectionAsync(bucketName)
    return (await collection.exists(id)).exists
}

var _addAsync = async function (bucketName, id, data, options) {
    var collection = await _defaultCollectionAsync(bucketName)
    return await collection.insert(id, data, options)
}

var _updateAsync = async function (bucketName, id, data) {
    var collection = await _defaultCollectionAsync(bucketName)
    return await collection.replace(id, data)
}

module.exports
    = {
    clusterAsync: _clusterAsync,
    bucketAsync: _bucketAsync,
    defaultCollectionAsync: _defaultCollectionAsync,
    getByIdAsync: _getByIdAsync,
    addAsync: _addAsync,
    getListAsync: _getListAsync,
    updateAsync: _updateAsync,
    existsAsync: _existsAsync
}