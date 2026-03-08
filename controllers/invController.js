const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildDetail = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const vehicleData = await invModel.getInventoryItemById(inv_id);

    if (!vehicleData) {
      return next({ status: 404, message: 'Vehicle not found' });
    }

    const vehicleDetailHTML = utilities.buildVehicleDetailHTML(vehicleData);
    let nav = await utilities.getNav();

    res.render("inventory/detail", {
      title: `${vehicleData.make} ${vehicleData.model}`,
      nav,
      vehicle: vehicleData,
      vehicleDetailHTML
    });
  } catch (error) {
    next(error);
  }
}

  module.exports = invCont
