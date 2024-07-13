const express = require('express');
const router = express.Router();
const { getWasherBrands, getOneWasherBrand, createOneWasherBrand, updateOneWasherBrand, deleteOneWasherBrand } = require('../controllers/washerBrandController');

router.get('/', getWasherBrands);
router.get('/:id', getOneWasherBrand);
router.post('/', createOneWasherBrand);
router.put('/:id', updateOneWasherBrand);
router.delete('/:id', deleteOneWasherBrand);

module.exports = router;