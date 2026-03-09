const utilities = require(".")
const { body, validationResult } = require("express-validator")

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
    .escape()
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("A valid email is required.")
    .normalizeEmail(),

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

module.exports = validate