const express = require('express');
const router = express.Router();
const {
    getAulas, createAula,
    getNiveles, createNivel,
    getGrados, createGrado
} = require('../controllers/estructuraController');
const { verificarToken, esAdminODirector } = require('../middlewares/authMiddleware');

router.get('/aulas', verificarToken, esAdminODirector, getAulas);
router.post('/aulas', verificarToken, esAdminODirector, createAula);

router.get('/niveles', verificarToken, esAdminODirector, getNiveles);
router.post('/niveles', verificarToken, esAdminODirector, createNivel);

router.get('/grados', verificarToken, esAdminODirector, getGrados);
router.post('/grados', verificarToken, esAdminODirector, createGrado);

module.exports = router;
