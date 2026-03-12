const express = require("express");
const router = express.Router();
const inquiryController = require("../controllers/inquiryController");
const utilities = require("../utilities");
const { body } = require("express-validator");

// Inquiry validation rules
const inquiryRules = [
  body("inquiry_firstname")
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name is required."),
  body("inquiry_lastname")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last name is required."),
  body("inquiry_email")
    .trim()
    .isEmail()
    .withMessage("A valid email address is required."),
  body("inquiry_message")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Message must be at least 10 characters.")
];

// Inquiry form view (GET) - public
router.get("/:inv_id", utilities.handleErrors(inquiryController.buildInquiryView));

// Submit inquiry (POST) - public
router.post("/submit", inquiryRules, utilities.handleErrors(inquiryController.submitInquiry));

// View all inquiries (GET) - Employee/Admin only
router.get("/", utilities.checkLogin, utilities.checkAccountType,
  utilities.handleErrors(inquiryController.buildAllInquiries));

module.exports = router;