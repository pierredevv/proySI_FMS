const express = require('express');
const router = express.Router();
const { getAulas, createAula, getNiveles, getGrados } = require('../controllers/estructuraController');

router.get('/aulas', getAulas);
router.post('/aulas', createAula);
router.get('/niveles', getNiveles);
router.get('/grados', getGrados);

module.exports = router;
