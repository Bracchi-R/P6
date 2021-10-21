const express = require('express');
const router = express.Router();

const SauceCtrl = require('../controllers/Sauce');
const auth = require('../middleware/auth'); // Route de protection
const multer = require('../middleware/multer-config');

// On ajout auth pour proteger le route
// Renvoyer un tableau contenant de toute les sauces
router.get('/', auth, SauceCtrl.getAllSauce);

// Enregistrement des nouvelle Sauce dans la Base de Données
router.post('/', auth, multer, SauceCtrl.createSauce);

// Renvoyer une seul sauce
router.get('/:id', auth, SauceCtrl.getOneSauce);

// Modifier une sauce existant
router.put('/:id', auth, multer, SauceCtrl.modifySauce);

// suppression de la sauce
router.delete('/:id', auth, SauceCtrl.deleteSauce);

// Like ou DisLike
router.post('/:id/like', auth, sauceCtrl.likeOrNot)


module.exports = router;