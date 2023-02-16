const express = require('express')
const router = express.Router()

const reservationService = require('../service/reservation')

router.post('/reservation', async (req, res) => {
    console.log(req.body)
    await reservationService.addReservation(req.body)
    res.send('reservation add.')
})

router.put('/reservation/:id', (req, res) => {
    console.log(req.body)
    res.send('reservation update.')
})

router.get('/reservation/:id', (req, res) => {
    console.log(req.body)
    res.send('reservation get.')
})

router.get('/reservations/:guest_id', (req, res) => {
    res.send(req.params)
})

router.delete('/reservation/:id', (req, res) => {
    console.log(req.body)
    res.send('reservation delete.')
})

module.exports = router