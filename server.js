/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
const cookieParser = require('cookie-parser');

const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const flash = require("connect-flash")
const pgSession = require("connect-pg-simple")(session)
const env = require("dotenv").config()
const pool = require('./database/')
const utilities = require("./utilities/")
const baseController = require("./controllers/baseController")
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require('./routes/accountRoute')
const app = express()
const bodyParser = require("body-parser")
const inquiryRoute = require("./routes/inquiryRoute");
/* ***********************
 * Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "layouts/layout")

/* ***********************
 * Middleware
 *************************/
// 1️⃣ Session middleware (must come first)

// Week5 - Adding packages
app.use(cookieParser());
app.use(utilities.checkJWTToken)

app.use(express.json());

app.use(session({
  store: new pgSession({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// 2️⃣ Flash middleware (after session)
app.use(flash())
// 3️⃣ Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Week 5 Showing what user has been log in
// Set defaults for EJS templates
app.use((req, res, next) => {
  res.locals.loggedin = res.locals.loggedin || 0; // 0 = not logged in
  res.locals.accountData = res.locals.accountData || {};
  next();
});

app.use("/inquiry", inquiryRoute);

/* ***********************
 * Routes
 *************************/
app.use(static)
app.use('/account', accountRoute)
app.use("/inv", inventoryRoute)

// route for the error 404
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})
/* ***********************
/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  const status = err.status || 500
  const message =
    status === 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?"
  res.status(status).render("errors/error", {
    title: status === 404 ? "404 Not Found" : "Server Error",
    message,
    nav
  })
})
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

