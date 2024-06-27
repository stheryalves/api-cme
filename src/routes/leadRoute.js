const express = require('express');
const router = express.Router();
const leadsController = require('../controllers/leadsController');


router.get('/', leadsController.getLeads);
router.get('/:id', leadsController.getOneLead);
router.post('/', leadsController.createOneLead);
router.put('/:id', leadsController.updateOneLead);
router.delete('/:id', leadsController.deleteOneLead);

module.exports = router;