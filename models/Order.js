const { pool } = require('../db');

class Order {
  #tableName = "orders";

  // buh zahialga
  async getAllOrders({ limit = 10, page = 0 } = {}) {
    const offset = page * limit;
    const result = await pool.query(
      `SELECT * FROM ${this.#tableName} ORDER BY id DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  // hereglegcheer zahialga avah
  async getOrdersByUser(user_id) {
    const result = await pool.query(
      `SELECT * FROM ${this.#tableName} WHERE user_id=$1 ORDER BY id DESC`,
      [user_id]
    );
    return result.rows;
  }

  // zahialga uusgeh
  async createOrder(dto) {
    const { user_id, total_amount, shipping_address, payment_id, status = 'pending' } = dto;
    const result = await pool.query(
      `INSERT INTO ${this.#tableName} 
       (user_id, total_amount, shipping_address, payment_id, status)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [user_id, total_amount, shipping_address, payment_id, status]
    );
    return result.rows[0];
  }

  // zahialga ID aar avah
  async getOrderById(id) {
    const result = await pool.query(
      `SELECT * FROM ${this.#tableName} WHERE id=$1`,
      [id]
    );
    return result.rows[0];
  }

  // zahialga shinechleh
  async updateOrder(id, dto) {
    const { status, shipping_address, total_amount, payment_id } = dto;
    const result = await pool.query(
      `UPDATE ${this.#tableName} 
       SET status = COALESCE($1, status),
           shipping_address = COALESCE($2, shipping_address),
           total_amount = COALESCE($3, total_amount),
           payment_id = COALESCE($4, payment_id)
       WHERE id=$5 RETURNING *`,
      [status, shipping_address, total_amount, payment_id, id]
    );
    return result.rows[0];
  }

  // zahialga uusgeh
  async deleteOrder(id) {
    const result = await pool.query(
      `DELETE FROM ${this.#tableName} WHERE id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Order;
