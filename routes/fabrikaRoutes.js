// routes/fabrikaRoutes.js
const express = require('express');
const router = express.Router();
const { getFabrikalar, createFabrika, deleteFabrika } = require('../controllers/fabrikaController');

// "/" isteği gelirse (GET -> Listele, POST -> Ekle)
router.route('/').get(getFabrikalar).post(createFabrika);

// "/:id" isteği gelirse (DELETE -> Sil)
router.route('/:id').delete(deleteFabrika);

module.exports = router;