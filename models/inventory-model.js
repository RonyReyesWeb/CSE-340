const pool = require("../database/");

/* ***************************
 *  Get all classification data
 ************************** */
async function getClassifications() {
  const data = await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
  return data.rows;
}

/* ***************************
 *  Get all inventory items by classification_id
 ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error);
  }
}

/* ***************************
 *  Get single inventory item by inv_id
 ************************** */
async function getInventoryItemById(inv_id) {
  try {
    const sql = "SELECT * FROM public.inventory WHERE inv_id = $1";
    const result = await pool.query(sql, [inv_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error in getInventoryItemById:", error);
    throw error;
  }
}

/* ***************************
 * Insert a new classification
 ************************** */
async function insertClassification(classification_name) {
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1)";
    const result = await pool.query(sql, [classification_name]);
    return result;
  } catch (error) {
    console.error("Error in insertClassification:", error);
    throw error;
  }
}

/* ***************************
 * Insert a new inventory item
 ************************** */
async function insertInventory(invData) {
  try {
    const {
      inv_make,
      inv_model,
      inv_price,
      inv_year,
      inv_miles,
      inv_image,
      classification_id
    } = invData;

    const sql = `INSERT INTO public.inventory 
      (inv_make, inv_model, inv_price, inv_year, inv_miles, inv_image, classification_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    
    const result = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_price,
      inv_year,
      inv_miles,
      inv_image,
      classification_id
    ]);

    return result;
  } catch (error) {
    console.error("Error in insertInventory:", error);
    throw error;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryItemById,
  insertClassification,
  insertInventory
};