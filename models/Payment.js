const { pool } = require('../db');

class Payment {
  #tableName = 'payment';

  async createPayment(dto) {
    const { user_id, amount, method_id, status, paid_at } = dto;
    const result = await pool.query(
      `INSERT INTO ${this.#tableName} (user_id, amount, method_id, status, paid_at, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,NOW(),NOW()) RETURNING *`,
      [user_id, amount, method_id, status, paid_at || null]
    );
    return result.rows[0];
  }

  async getPaymentById(id) {
    const result = await pool.query(
      `SELECT * FROM ${this.#tableName} WHERE id=$1`,
      [id]
    );
    return result.rows[0];
  }

  async getAllPayments() {
    const result = await pool.query(`SELECT * FROM ${this.#tableName}`);
    return result.rows;
  }

  async updatePayment(id, dto) {
    const { amount, status, method_id, paid_at } = dto;
    const result = await pool.query(
      `UPDATE ${this.#tableName} 
       SET amount=$1, status=$2, method_id=$3, paid_at=$4, updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [amount, status, method_id, paid_at, id]
    );
    return result.rows[0];
  }

  async deletePayment(id) {
    const result = await pool.query(
      `DELETE FROM ${this.#tableName} WHERE id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  async getPaymentsByUser(user_id) {
    const result = await pool.query(
      `SELECT * FROM ${this.#tableName} WHERE user_id=$1`,
      [user_id]
    );
    return result.rows;
  }
}

module.exports = Payment;
