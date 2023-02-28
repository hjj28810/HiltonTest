const express = require('express')
const app = express()
require('express-async-errors');
const util = require('./util/index')
const Schema = require('./schema');
const gqlHTTP = require('express-graphql')
// app.use('/files', express.static('./files'))
//对body-parser进行配置

var filter = async (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    // if (req.url === '/graphql') {
    //     next()
    //     return
    // }
    // var isCheck = await util.checkSumAsync(req.get('nonce'), req.get('curTime'), req.get('checkSum'))
    // if (!isCheck)
    //     return res.json({ code: 500, message: "验签失败" });
    // else
    next()
}
app.use(filter);

const loggingMiddleware = (req, res, next) => {
    console.log('ip:', req.ip);
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
app.use('/api/v1', reservationRouter)
app.use('/api/v1', guestRouter)

app.use('/graphql', gqlHTTP.graphqlHTTP({
    schema: Schema,
    graphiql: true,
}));

app.use((err, req, res, next) => {
    return res.json({ code: 500, message: "服务器异常:" + err });
});


app.listen(8081, () => {
    console.log('http://127.0.0.1 listening on port 8081')
})

