const supertest = require('supertest')
const app = require('../app.js');
const { v4: uuidv4 } = require('uuid');
const cryptoJS = require("crypto-js");
const should = require('should')

request = supertest(app);
describe('app js test', function () {
    describe('GET /', function () {
        it('should respond to GET with reservations', function (done) {
            this.timeout(10000);
            setTimeout(() => {
                var nonce = uuidv4();
                var curTime = Math.floor(new Date().getTime() / 1000);
                request.get('/api/v1/reservations')
                    .query({ guest_id: '13321952950' })
                    .set('Content-Type', 'application/json')
                    .set('Nonce', nonce)
                    .set('CurTime', curTime)
                    .set('CheckSum', cryptoJS.SHA1(`6f2ad63f0ef2${nonce}${curTime}`).toString(cryptoJS.enc.Hex))
                    //去掉jwt验证，在app.js 增加credentialsRequired: false
                    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkVtcGxveWVlIiwiaWF0IjoxNjc4MTUyNDk0LCJleHAiOjE2NzgxNTk2OTR9.SmQQc1EaS_hZBRITu9WXgS3QiOn0MikbYY0_iGzQeLQ')
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        should.exist(res.body.data)
                        done()
                    });
            }, 2000);
        });
    });

    describe('Post /', function () {
        it('should respond to POST with guests', function (done) {
            // this.timeout(10000);
            // setTimeout(() => {
            var nonce = uuidv4();
            var curTime = Math.floor(new Date().getTime() / 1000);
            var id = '13321952952'
            request.post('/api/v1/guests')
                .send({ id: id, name: 'test' })
                .set('Content-Type', 'application/json')
                .set('Nonce', nonce)
                .set('CurTime', curTime)
                .set('CheckSum', cryptoJS.SHA1(`6f2ad63f0ef2${nonce}${curTime}`).toString(cryptoJS.enc.Hex))
                //去掉jwt验证，在app.js 增加credentialsRequired: false
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkVtcGxveWVlIiwiaWF0IjoxNjc4MTUyNDk0LCJleHAiOjE2NzgxNTk2OTR9.SmQQc1EaS_hZBRITu9WXgS3QiOn0MikbYY0_iGzQeLQ')
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.text.should.containEql(id);
                    done()
                });
            // }, 1000);
        });
    });
});


