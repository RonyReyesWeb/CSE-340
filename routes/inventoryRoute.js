const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities"); 

// Build inventory by classification
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Vehicle detail route
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildDetail));

// Optional: 500-error test route
router.get("/trigger-error",utilities.handleErrors(async (req, res) => {throw new Error("Intentional server error for testing");}));

module.exports = router;