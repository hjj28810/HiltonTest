const cryptoJS = require("crypto-js");
const couchbase = require('../storage/couchbase')
const conf = require('../config/conf.json')
class Util {
    async checkSumAsync(nonce, curTimeStr, checkSum) {
        try {
            var curTime = Number(curTimeStr)
            if (!curTime)
                return false
            var curSec = new Date().getTime() / 1000
            if (curSec > curTime + 60 || curSec < curTime - 60)
                return false
            if (await couchbase.existsAsync('checkSum', nonce))
                return false
            if (cryptoJS.SHA1(`${conf.checkSumKey}${nonce}${curTime}`).toString(cryptoJS.enc.Hex) !== checkSum)
                return false
            await couchbase.addAsync('checkSum', nonce, curTime, { expiry: 60 })
            return true
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = new Util()