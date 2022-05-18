const express = require('express')
const router = express.Router()

const urlController = require("../controller/urlController")

router.post("/url",urlController.createUrl)
router.get("/:urlCode",urlController.getUrl)


module.exports = router;
