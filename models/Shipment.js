const { pool } = require('../db');

class Shipment {
  #tableName = 'shipments';

  async createShipment(dto) {
    const { order_id, method_id, tracking_no, shipped_at, delivered_at } = dto;
    const result = await pool.query(
      `INSERT INTO ${this.#tableName} (order_id, method_id, tracking_no, shipped_at, delivered_at)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [order_id, method_id, tracking_no, shipped_at, delivered_at]
    );
    return result.rows[0];
  }

  async getShipment(id) {
    const result = await pool.query(`SELECT * FROM ${this.#tableName} WHERE id=$1`, [id]);
    return result.rows[0];
  }

  async getAllShipments() {
    const result = await pool.query(`SELECT * FROM ${this.#tableName}`);
    return result.rows;
  }

  async updateShipment(id, dto) {
    const { method_id, tracking_no, shipped_at, delivered_at } = dto;
    const result = await pool.query(
      `UPDATE ${this.#tableName}
       SET method_id=$1, tracking_no=$2, shipped_at=$3, delivered_at=$4
       WHERE id=$5 RETURNING *`,
      [method_id, tracking_no, shipped_at, delivered_at, id]
    );
    return result.rows[0];
  }

  async deleteShipment(id) {
    const result = await pool.query(
      `DELETE FROM ${this.#tableName} WHERE id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Shipment;
