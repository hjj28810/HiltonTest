const express = require('express')
const router = express.Router()
const guestService = require('../service/guest')

router.get('/guests/:id', async (req, res) => {
    res.send({ code: 200, msg: "查询成功", data: await guestService.getGuestAsync(req.params.id) })
})

router.post('/guests', async (req, res) => {
    res.send({ code: 200, msg: "新增成功", data: await guestService.addGuestAsync(req.body) })
})

router.get('/guests', async (req, res) => {
    res.send({ code: 200, msg: "查询成功", data: await guestService.getGuestsAsync(req.query) })
})

module.exports = router