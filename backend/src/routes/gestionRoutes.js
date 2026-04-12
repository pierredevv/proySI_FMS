const express = require('express');
const router = express.Router();
const { createGestion, getGestiones, updateGestion } = require('../controllers/gestionController');

router.post('/', createGestion);
router.get('/', getGestiones);
router.put('/:id', updateGestion);

module.exports = router;
