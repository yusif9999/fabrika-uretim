const express = require('express');
const router = express.Router(); // <-- Düzeltme burada yapıldı (Büyük R)
const { loginUser, setupAdmin } = require('../controllers/authController');

router.post('/login', loginUser);
router.post('/setup', setupAdmin);

module.exports = router;