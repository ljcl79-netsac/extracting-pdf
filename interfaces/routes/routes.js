const express = require('express');
const erpController = require('../controllers/Controller');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post("/extract", erpController.extract);
router.post("/merge", upload.single('file_add'), erpController.merge);

module.exports = router;
