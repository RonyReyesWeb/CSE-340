const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  const data = await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name")
  return data.rows
}

module.exports = {getClassifications}