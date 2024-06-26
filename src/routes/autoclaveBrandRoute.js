const express = require('express');
const router = express.Router();
const autoclaveBrandController = require('../controllers/autoclaveBrandController');

router.get('/', autoclaveBrandController.getBrands);
router.get('/:id', autoclaveBrandController.getOneBrand);
router.post('/', autoclaveBrandController.createOneBrand);
router.put('/:id', autoclaveBrandController.updateOneBrand);
router.delete('/:id', autoclaveBrandController.deleteOneBrand);

module.exports = router;