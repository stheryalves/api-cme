const express = require('express');
const router = express.Router();
const brandController = require('./../controllers/brandController');

// let brands = []

router.get('/', brandController.getBrands);
router.get('/:id', brandController.getOneBrand);
router.post('/', brandController.createOneBrand);
router.put('/:id', brandController.updateOneBrand);
router.delete('/:id', brandController.deleteOneBrand);

module.exports = router;