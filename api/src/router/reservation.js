const express = require('express')
const router = express.Router()
const reservationService = require('../service/reservation')

router.post('/reservations', async (req, res) => {
    res.send({ code: 200, msg: "新增成功", data: await reservationService.addReservationAsync(req.body) })
})

router.put('/reservations', async (req, res) => {
    res.send({ code: 200, msg: "处理成功", data: await reservationService.updateReservationAsync(req.body) })
})

router.get('/reservations/:id', async (req, res) => {
    res.send({ code: 200, msg: "查询成功", data: await reservationService.getReservationAsync(req.params.id) })
})

router.get('/reservations', async (req, res) => {
    res.send({ code: 200, msg: "查询成功", data: await reservationService.getReservationsAsync(req.query) })
})

module.exports = router