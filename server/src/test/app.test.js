const supertest = require('supertest')
const app = require('../app.js');
const request = supertest(app);
const { v4: uuidv4 } = require('uuid');
const cryptoJS = require("crypto-js");
const should = require('should')

describe('app js test', function () {
    describe('GET /', function () {
        it('should respond to GET with reservations', function (done) {
            var nonce = uuidv4();
            var curTime = Math.floor(new Date().getTime() / 1000);
            request.get('/api/v1/reservations')
                .query({ guest_id: '13321952950' })
                .set('Content-Type', 'application/json')
                .set('Nonce', nonce)
                .set('CurTime', curTime)
                .set('CheckSum', cryptoJS.SHA1(`6f2ad63f0ef2${nonce}${curTime}`).toString(cryptoJS.enc.Hex))
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.data)
                    done()
                });
        });
    });

    describe('Post /', function () {
        it('should respond to POST with guests', function (done) {
            var nonce = uuidv4();
            var curTime = Math.floor(new Date().getTime() / 1000);
            var id = '13321952952'
            request.post('/api/v1/guests')
                .send({ id: id, name: 'test' })
                .set('Content-Type', 'application/json')
                .set('Nonce', nonce)
                .set('CurTime', curTime)
                .set('CheckSum', cryptoJS.SHA1(`6f2ad63f0ef2${nonce}${curTime}`).toString(cryptoJS.enc.Hex))
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.text.should.containEql(id);
                    done()
                });
        });
    });
});