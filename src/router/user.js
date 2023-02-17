const express = require('express')
const router = express.Router()

router.post('/user/add', (req, res) => {
    res.send('Add new user.')
})

module.exports = router