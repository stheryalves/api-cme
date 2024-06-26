const express = require('express');
const router = express.Router();

// let brands = []

router.get('/', (req, res) => {
    console.log('Entrei em modelRouter.js')
    res.status(200).send('Rota de modelos')
})

module.exports = router;