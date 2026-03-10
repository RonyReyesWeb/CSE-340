const { body, validationResult } = require('express-validator');
const utilities = require("../utilities");

const inventoryValidation = {};

// Validation rules for adding a new classification
inventoryValidation.addClassificationRules = [
  body('classification_name')
    .trim()
    .notEmpty().withMessage('Classification name is required')
    .matches(/^[A-Za-z0-9]+$/).withMessage('Classification name cannot contain spaces or special characters')
];

// Validation rules for adding a new inventory item
inventoryValidation.addInventoryRules = [
  body('classification_id')
    .notEmpty()
    .withMessage('Classification must be selected'),

  body('inv_make')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Vehicle make must be at least 3 characters'),

  body('inv_model')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Vehicle model must be at least 3 characters'),

  body('inv_year')
    .notEmpty()
    .withMessage('Year is required')
    .isInt({ min: 1900, max: 2100 })
    .withMessage('Year must be a valid 4-digit number'),

  body('inv_description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),

  body('inv_image')
    .trim()
    .notEmpty()
    .withMessage('Image path is required'),

  body('inv_thumbnail')
    .trim()
    .notEmpty()
    .withMessage('Thumbnail path is required'),

  body('inv_price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a valid number'),

  body('inv_miles')
    .notEmpty()
    .withMessage('Mileage is required')
    .isInt({ min: 0 })
    .withMessage('Mileage must be a positive number'),

  body('inv_color')
    .trim()
    .notEmpty()
    .withMessage('Color is required')
];

// Check data for updating inventory (redirects to edit view on error)
inventoryValidation.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    return res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: errors.array(),
      message: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
  next();
};

module.exports = inventoryValidation;