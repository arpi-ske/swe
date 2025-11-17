const { pool } = require('../db');

class Cart {
  #tableName = 'cart';

  async getCartByUser(user_id) {
    const result = await pool.query(
      `SELECT c.id, c.user_id, c.product_id, p.name AS product_name, p.price, c.quantity
       FROM ${this.#tableName} c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [user_id]
    );
    return result.rows;
  }

  async addToCart(dto) {
    const { user_id, product_id, quantity } = dto;
    const result = await pool.query(
      `INSERT INTO ${this.#tableName} (user_id, product_id, quantity)
       VALUES ($1, $2, $3) RETURNING *`,
      [user_id, product_id, quantity]
    );
    return result.rows[0];
  }

  async updateCart(id, quantity) {
    const result = await pool.query(
      `UPDATE ${this.#tableName} SET quantity=$1 WHERE id=$2 RETURNING *`,
      [quantity, id]
    );
    return result.rows[0];
  }

  async deleteCartItem(id) {
    const result = await pool.query(
      `DELETE FROM ${this.#tableName} WHERE id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Cart;
