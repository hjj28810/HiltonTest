const express = require('express')
const router = express.Router()
const guestService = require('../service/guest')

router.post('/login', async (req, res) => {
    res.send({ code: 200, msg: "登录成功", data: await guestService.loginAsync(req.body) })
})

module.exports = router