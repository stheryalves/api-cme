const express = require('express');
const router = express.Router();
const { getLeads, getOneLead, createOneLead, updateOneLead, deleteOneLead } = require('../controllers/leadsController');

router.get('/', getLeads);
router.get('/:id', getOneLead);
router.post('/', createOneLead);
router.put('/:id', updateOneLead);
router.delete('/:id', deleteOneLead);

module.exports = router;