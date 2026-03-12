const inquiryModel = require("../models/inquiry-model");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities");
const { validationResult } = require("express-validator");

/* ***************************
 * Build inquiry form view
 * ************************** */
async function buildInquiryView(req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    const nav = await utilities.getNav();
    const vehicleData = await invModel.getInventoryItemById(inv_id);

    if (!vehicleData) {
      return next({ status: 404, message: "Vehicle not found" });
    }

    // Pre-fill account data if logged in
    const accountData = res.locals.accountData || {};

    res.render("inquiry/inquiry-form", {
      title: `Inquire About ${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      errors: null,
      message: req.flash("message"),
      vehicleData,
      inquiry_firstname: accountData.account_firstname || "",
      inquiry_lastname: accountData.account_lastname || "",
      inquiry_email: accountData.account_email || "",
      inquiry_message: "",
      inv_id
    });
  } catch (error) {
    next(error);
  }
}

/* ***************************
 * Process inquiry form submission
 * ************************** */
async function submitInquiry(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const {
      inquiry_firstname,
      inquiry_lastname,
      inquiry_email,
      inquiry_message,
      inv_id
    } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const vehicleData = await invModel.getInventoryItemById(inv_id);
      return res.render("inquiry/inquiry-form", {
        title: `Inquire About ${vehicleData.inv_make} ${vehicleData.inv_model}`,
        nav,
        errors: errors.array(),
        message: null,
        vehicleData,
        inquiry_firstname,
        inquiry_lastname,
        inquiry_email,
        inquiry_message,
        inv_id
      });
    }

    const account_id = res.locals.accountData?.account_id || null;

    const result = await inquiryModel.insertInquiry(
      inquiry_firstname,
      inquiry_lastname,
      inquiry_email,
      inquiry_message,
      inv_id,
      account_id
    );

    if (result) {
      req.flash("message", "Your inquiry was submitted successfully! We will contact you soon.");
      res.redirect(`/inv/detail/${inv_id}`);
    } else {
      req.flash("message", "Sorry, the inquiry could not be submitted. Please try again.");
      res.redirect(`/inquiry/${inv_id}`);
    }
  } catch (error) {
    next(error);
  }
}

/* ***************************
 * Build view all inquiries (admin/employee only)
 * ************************** */
async function buildAllInquiries(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const inquiries = await inquiryModel.getAllInquiries();

    res.render("inquiry/inquiry-list", {
      title: "All Inquiries",
      nav,
      errors: null,
      message: req.flash("message"),
      inquiries
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { buildInquiryView, submitInquiry, buildAllInquiries };