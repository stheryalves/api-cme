const express = require('express');
const router = express.Router();
const { getAutoclaveModels, getOneAutoclaveModel, createOneAutoclaveModel, updateOneAutoclaveModel, deleteOneAutoclaveModel } = require('../controllers/autoclaveModelController');

router.get('/', getAutoclaveModels);
router.get('/:id', getOneAutoclaveModel);
router.post('/', createOneAutoclaveModel);
router.put('/:id', updateOneAutoclaveModel);
router.delete('/:id', deleteOneAutoclaveModel);

module.exports = router;
