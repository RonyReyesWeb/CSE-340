const pool = require("../database/");

/* ***************************
 * Insert a new inquiry
 * ************************** */
async function insertInquiry(
  inquiry_firstname,
  inquiry_lastname,
  inquiry_email,
  inquiry_message,
  inv_id,
  account_id
) {
  try {
    const sql = `INSERT INTO public.inquiry 
      (inquiry_firstname, inquiry_lastname, inquiry_email, inquiry_message, inv_id, account_id) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const result = await pool.query(sql, [
      inquiry_firstname,
      inquiry_lastname,
      inquiry_email,
      inquiry_message,
      inv_id || null,
      account_id || null
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("insertInquiry error:", error);
    throw error;
  }
}

/* ***************************
 * Get all inquiries (for admin/employee view)
 * ************************** */
async function getAllInquiries() {
  try {
    const sql = `SELECT i.*, 
      inv.inv_make, inv.inv_model, inv.inv_year
      FROM public.inquiry i
      LEFT JOIN public.inventory inv ON i.inv_id = inv.inv_id
      ORDER BY i.inquiry_date DESC`;
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    console.error("getAllInquiries error:", error);
    throw error;
  }
}

module.exports = { insertInquiry, getAllInquiries };