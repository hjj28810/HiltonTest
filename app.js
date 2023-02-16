const express = require('express')
const app = express()

// app.use('/files', express.static('./files'))
//对body-parser进行配置
const bodyParser = require('body-parser');
//设置完毕之后，会在req对象上面新增一个req.body的一个对象
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// const couchbase = require('./storage/couchbase')
// couchbase.initAsync()

const reservationRouter = require('./router/reservation.js')

app.use('/api', reservationRouter)

app.listen(8081, () => {
    console.log('http://127.0.0.1 listening on port 8081')
})

