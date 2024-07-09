const express = require('express');
const router = express.Router();
const { getLeads, getOneLead, createOneLead, updateOneLead, deleteOneLead, checkFormLead } = require('../controllers/leadsController');

router.get('/', getLeads);
router.get('/:id', getOneLead);
router.post('/', createOneLead);
router.put('/:id', updateOneLead);
router.delete('/:id', deleteOneLead);
router.post('/formcheck', checkFormLead)

module.exports = router;