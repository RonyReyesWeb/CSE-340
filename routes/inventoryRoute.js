const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities"); 
const inventoryValidation = require("../validation/inventory-validation");
// Management view
router.get('/', invController.buildManagementView);

// Add classification
router.get('/add-classification', invController.buildAddClassification);
router.post(
  '/add-classification',
  inventoryValidation.addClassificationRules,
  invController.addClassification
);

// Add inventory item
router.get('/add-inventory', invController.buildAddInventory);
router.post(
  '/add-inventory',
  inventoryValidation.addInventoryRules,
  invController.addInventoryItem
);

// Build inventory by classification
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Vehicle detail route
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildDetail));

// Optional: 500-error test route
router.get("/trigger-error",utilities.handleErrors(async (req, res) => {throw new Error("Intentional server error for testing");}));

// Week 5 adding route and return the json 
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
// Edit inventory view (Step 1 - GET)
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));
// Update inventory (Step 2 - POST)
router.post("/update/", inventoryValidation.addInventoryRules, inventoryValidation.checkUpdateData, utilities.handleErrors(invController.updateInventory));
// Week 5 team activity
// Delete confirmation view (GET)
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteView));

// Delete inventory item (POST)
router.post("/delete/", utilities.handleErrors(invController.deleteInventory));

module.exports = router;