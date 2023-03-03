const express = require('express')
const app = express()
require('express-async-errors');
const util = require('./util/index')
const Schema = require('./schema');
const gqlHTTP = require('express-graphql')
const log = require('./util/log')
const { expressjwt } = require("express-jwt")
const conf = require('./config/conf.json')

var cors = require('cors')
app.use(cors())

app.use(expressjwt({
    secret: conf.jwtSecret,
    algorithms: ["HS256"]
    //,credentialsRequired: false //允许不验证jwt
}).unless({ path: ["api/v1/login"] }))

var filter = async (req, res, next) => {
    // if (req.url === '/graphql') {
    //     next()
    //     return
    // }//如果在浏览器中使用graphQL解注
    var isCheck = await util.checkSumAsync(req.get('nonce'), req.get('curTime'), req.get('checkSum'))
    if (!isCheck)
        return res.json({ code: 500, message: "验签失败" });
    else
        next()
}
app.use(filter);

const loggingMiddleware = (req, res, next) => {
    log.infoLog(req.url)
    log.infoLog(req.params)
    log.infoLog(req.query)
    log.infoLog(req.body)
    next();
}
app.use(loggingMiddleware);

const bodyParser = require('body-parser');
//设置完毕之后，会在req对象上面新增一个req.body的一个对象
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// const couchbase = require('./storage/couchbase')
// couchbase.initAsync()

const reservationRouter = require('./router/reservation.js')
const guestRouter = require('./router/guest.js')
const sessionRouter = require('./router/session.js')
app.use('/api/v1', reservationRouter)
app.use('/api/v1', guestRouter)
app.use('/api/v1', sessionRouter)

app.use('/graphql', gqlHTTP.graphqlHTTP({
    schema: Schema,
    graphiql: true,
}));

app.use((err, req, res, next) => {
    log.errorLog(err)
    if (err.name == "UnauthorizedError") {
        return res.json({ code: 401, message: "无效的token" });
    } else {
        next(err);
    }
    return res.json({ code: 500, message: "服务器异常:" + err });
});


app.listen(8081, () => {
    console.log('http://127.0.0.1 listening on port 8081')
})

module.exports = app;
