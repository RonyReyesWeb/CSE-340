const invModel = require("../models/inventory-model")
const utilities = require("../utilities")
const { validationResult } = require("express-validator");

// *********************************
// Build Inventory Management Page
// *********************************
async function buildManagementView(req, res, next) {
  try {
    const nav = await utilities.getNav();
    // Week 5 Build the classification dropdown list
    const classificationSelect = await utilities.buildClassificationList()
    const message = req.flash("message");
    res.render("inventory/management", {
      title: "Inventory Management",
      message,
      nav,
      classificationSelect
    });
  } catch (error) {
    next(error)
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
      classification_id: '',
      inv_make: '',
      inv_model: '',
      inv_year: '',
      inv_description: '',
      inv_image: '/images/no-image.png',
      inv_thumbnail: '/images/no-image.png',
      inv_price: '',
      inv_miles: '',
      inv_color: '',
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
      classification_id: req.body.classification_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
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

// week 5 
/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
async function getInventoryJSON(req, res, next) {
  try {
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    if (invData[0]?.inv_id) {
      return res.json(invData);
    } else {
      return next(new Error("No data returned"));
    }
  } catch (error) {
    next(error);
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
async function editInventoryView(req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    const nav = await utilities.getNav();
    const itemData = await invModel.getInventoryItemById(inv_id);
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      message: req.flash("message"),
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
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
  buildDetail,
  getInventoryJSON,
  editInventoryView
};