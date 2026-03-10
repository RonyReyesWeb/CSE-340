const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
// const utilities = require("../utilities")

const validate = {}

/* **********************************
*  Registration Data Validation Rules
* ********************************* */
validate.registationRules = () => {
  return [

    body("account_firstname")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a first name.")
    .bail()
    .isLength({ min: 1 }),

    body("account_lastname")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a last name.")
    .bail()
    .isLength({ min: 2 }),

    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (emailExists) {
        throw new Error("Email exists. Please log in or use different email")
      }
    }),

    body("account_password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .bail()
    .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    .withMessage("Password does not meet requirements.")
  ]
}

/* ******************************
 * Check data and return errors
 * ***************************** */
validate.checkRegData = async (req, res, next) => {

  const { account_firstname, account_lastname, account_email } = req.body

  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {

    let nav = await utilities.getNav()

    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })

    return
  }

  next()
}

/* **********************************
*  Login Data Validation Rules
* ********************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
  ];
};

// Week 5 items
/* ******************************
 * Check login data and return errors
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();

    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email
    });

    return;
  }

  next();
};

//Week 5 project
// Validation rules for account update
validate.updateAccountRules = () => {
  return [
    body("account_firstname").trim().isLength({ min: 1 }).withMessage("First name is required."),
    body("account_lastname").trim().isLength({ min: 2 }).withMessage("Last name is required."),
    body("account_email").trim().isEmail().withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const account_id = req.body.account_id;
        const existingAccount = await accountModel.getAccountById(account_id);
        if (account_email !== existingAccount.account_email) {
          const emailExists = await accountModel.checkExistingEmail(account_email);
          if (emailExists) throw new Error("Email already exists. Please use a different email.");
        }
      }),
  ]
}

// Check account update data
validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account_firstname,
      account_lastname,
      account_email,
      accountData: req.body,
    });
  }
  next();
}

// Password validation rules
validate.passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/)
      .withMessage("Password must be 12+ characters with uppercase, number and special character."),
  ]
}

// Check password data
validate.checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(req.body.account_id);
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      accountData,
    });
  }
  next();
}

module.exports = validate