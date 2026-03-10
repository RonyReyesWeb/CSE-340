const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities"); 
const inventoryValidation = require("../validation/inventory-validation");
// Management view
router.get('/', utilities.checkLogin, utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagementView));

// Add classification - protected
router.get('/add-classification', utilities.checkLogin, utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification));
router.post('/add-classification', utilities.checkLogin, utilities.checkAccountType,
  inventoryValidation.addClassificationRules,
  invController.addClassification);

// Add inventory item - protected
router.get('/add-inventory', utilities.checkLogin, utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory));
router.post('/add-inventory', utilities.checkLogin, utilities.checkAccountType,
  inventoryValidation.addInventoryRules,
  invController.addInventoryItem);

// Build inventory by classification - PUBLIC (no protection)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Vehicle detail route - PUBLIC (no protection)
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildDetail));

// Optional: 500-error test route
router.get("/trigger-error", utilities.handleErrors(async (req, res) => {
  throw new Error("Intentional server error for testing");
}));

// Week 5 - return JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Edit inventory - protected
router.get("/edit/:inv_id", utilities.checkLogin, utilities.checkAccountType,
  utilities.handleErrors(invController.editInventoryView));

// Update inventory - protected
router.post("/update/", utilities.checkLogin, utilities.checkAccountType,
  inventoryValidation.addInventoryRules,
  inventoryValidation.checkUpdateData,
  utilities.handleErrors(invController.updateInventory));

// Delete confirmation - protected
router.get("/delete/:inv_id", utilities.checkLogin, utilities.checkAccountType,
  utilities.handleErrors(invController.buildDeleteView));

// Delete inventory - protected
router.post("/delete/", utilities.checkLogin, utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventory));

module.exports = router;