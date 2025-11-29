const express = require('express');
const router = express.Router();
const { getPersonel, createPersonel, updatePersonel, deletePersonel } = require('../controllers/personelController');

router.route('/')
    .get(getPersonel)
    .post(createPersonel);

router.route('/:id')
    .put(updatePersonel)
    .delete(deletePersonel);

module.exports = router;