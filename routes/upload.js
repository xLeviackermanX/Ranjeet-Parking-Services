const express = require("express");

const {
  upload, fetchBills, download
} = require("../controllers/upload");

const router = express.Router();

router.route("/").post(upload);
router.route("/bills").post(fetchBills);
router.route("/download").post(download);

module.exports = router;