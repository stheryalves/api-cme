const express = require('express');
const router = express.Router();
const { getAutoclaveBrands, getOneAutoclaveBrand, createOneAutoclaveBrand, updateOneAutoclaveBrand, deleteOneAutoclaveBrand } = require('../controllers/brandController');

router.get('/', getAutoclaveBrands);
router.get('/:id', getOneAutoclaveBrand);
router.post('/', createOneAutoclaveBrand);
router.put('/:id', updateOneAutoclaveBrand);
router.delete('/:id', deleteOneAutoclaveBrand);

module.exports = router;