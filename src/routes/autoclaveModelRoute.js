const express = require('express');
const router = express.Router();
const autoclaveModelController = require('../controllers/autoclaveModelController');


router.get('/', autoclaveModelController.getAutoclaveModels);
router.get('/:id', autoclaveModelController.getOneAutoclaveModel);
router.post('/', autoclaveModelController.createOneAutoclaveModel);
router.put('/:id', autoclaveModelController.updateOneAutoclaveModel);
router.delete('/:id', autoclaveModelController.deleteOneAutoclaveModel);

module.exports = router;