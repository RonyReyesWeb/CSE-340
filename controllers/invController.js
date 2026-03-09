const invModel = require("../models/inventory-model")
const utilities = require("../utilities")
const { validationResult } = require("express-validator");

// *********************************
// Build Inventory Management Page
// *********************************
async function buildManagementView(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const message = req.flash("message");
    res.render("inventory/management", {
      title: "Inventory Management",
      message,
      nav
    });
  } catch (error) {
    next(error);
  }
}

// *********************************
// Add Classification View
// *********************************
async function buildAddClassification(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      message: req.flash("message"),
      errors: null,
      nav
    });
  } catch (error) {
    next(error);
  }
}

// *********************************
// Add Classification POST
// *********************************
async function addClassification(req, res, next) {
  const errors = validationResult(req);
  const nav = await utilities.getNav();

  if (!errors.isEmpty()) {
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      errors: errors.array(),
      message: null,
      classification_name: req.body.classification_name,
      nav
    });
  }

  try {
    await invModel.insertClassification(req.body.classification_name);
    req.flash("message", `${req.body.classification_name} added successfully`);
    res.redirect("/inv/");
  } catch (error) {
    next(error);
  }
}

// *********************************
// Add Inventory View
// *********************************
async function buildAddInventory(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      message: null,
      errors: null,
      classificationList,
      nav,
      inv_make: '',
      inv_model: '',
      inv_price: '',
      inv_year: '',
      inv_miles: '',
      inv_image: '/images/no-image.png',
      classification_id: ''
    });
  } catch (error) {
    next(error);
  }
}

// *********************************
// Add Inventory POST
// *********************************
async function addInventoryItem(req, res, next) {
  const errors = validationResult(req);
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList(req.body.classification_id);

  if (!errors.isEmpty()) {
    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      message: null,
      errors: errors.array(),
      classificationList,
      nav,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_price: req.body.inv_price,
      inv_year: req.body.inv_year,
      inv_miles: req.body.inv_miles,
      inv_image: req.body.inv_image,
      classification_id: req.body.classification_id
    });
  }

  try {
    await invModel.insertInventory(req.body);
    req.flash("message", `${req.body.inv_make} ${req.body.inv_model} added successfully`);
    res.redirect("/inv/");
  } catch (error) {
    next(error);
  }
}

// *********************************
// Inventory by Classification
// *********************************
async function buildByClassificationId(req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();

    const className = data.length > 0 ? data[0].classification_name : "Unknown Classification";

    res.render("inventory/classification", {
      title: className + " vehicles",
      nav,
      grid
    });
  } catch (error) {
    next(error);
  }
}

// *********************************
// Vehicle Detail View
// *********************************
async function buildDetail(req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const vehicleData = await invModel.getInventoryItemById(inv_id);

    if (!vehicleData) {
      return next({ status: 404, message: "Vehicle not found" });
    }

    const vehicleDetailHTML = utilities.buildVehicleDetailHTML(vehicleData);
    const nav = await utilities.getNav();

    res.render("inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      vehicle: vehicleData,
      vehicleDetailHTML
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildManagementView,
  buildAddClassification,
  addClassification,
  buildAddInventory,
  addInventoryItem,
  buildByClassificationId,
  buildDetail
};