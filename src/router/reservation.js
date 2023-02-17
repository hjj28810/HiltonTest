const express = require('express')
const router = express.Router()

const reservationService = require('../service/reservation')

router.post('/reservations', async (req, res) => {
    res.send(await reservationService.addReservation(req.body))
})

router.put('/reservations', async (req, res) => {
    res.send(await reservationService.updateReservation(req.body))
})

router.get('/reservations/:id', async (req, res) => {
    res.send(await reservationService.getReservation(req.params.id))
})

router.get('/reservations', async (req, res) => {
    res.send(await reservationService.getReservations(req.query))
})

module.exports = router