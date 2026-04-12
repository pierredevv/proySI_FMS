const express = require('express');
const router = express.Router();
const { getCamposSaber, getMaterias, createMateria } = require('../controllers/materiaController');

router.get('/campos', getCamposSaber);
router.get('/', getMaterias);
router.post('/', createMateria);

module.exports = router;
