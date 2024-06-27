const express = require('express');
const router = express.Router();
const autoclaveBrandController = require('../controllers/autoclaveBrandController');

router.get('/', autoclaveBrandController.getAutoclaveBrands);
router.get('/:id', autoclaveBrandController.getOneAutoclaveBrand);
router.post('/', autoclaveBrandController.createOneAutoclaveBrand);
router.put('/:id', autoclaveBrandController.updateOneAutoclaveBrand);
router.delete('/:id', autoclaveBrandController.deleteOneAutoclaveBrand);

module.exports = router;