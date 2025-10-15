const express = require('express');
const erpController = require('../controllers/Controller');
const router = express.Router();

router.post("/extract", erpController.extract);

module.exports = router;
