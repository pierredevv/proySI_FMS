const express = require('express');
const router = express.Router();
const { getProfesores, createProfesor } = require('../controllers/profesorController');
const { verificarToken, esAdminODirector } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, esAdminODirector, getProfesores);
router.post('/', verificarToken, esAdminODirector, createProfesor);

module.exports = router;
