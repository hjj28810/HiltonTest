const express = require('express')
const router = express.Router()

router.post('/guest', (req, res) => {
    console.log(req.body)
    res.send('guest add.')
})

router.put('/guest/:id', (req, res) => {
    console.log(req.body)
    res.send('guest update.')
})

router.get('/guest/:id', (req, res) => {
    console.log(req.body)
    res.send('guest get.')
})

router.delete('/guest/:id', (req, res) => {
    console.log(req.body)
    res.send('guest delete.')
})

module.exports = router

