// const { pool } = require('../db');

// class Order {
//   #tableName = "orders";

//   // buh zahialga
//   async getAllOrders({ limit = 10, page = 0 } = {}) {
//     const offset = page * limit;
//     const result = await pool.query(
//       `SELECT * FROM ${this.#tableName} ORDER BY id DESC LIMIT $1 OFFSET $2`,
//       [limit, offset]
//     );
//     return result.rows;
//   }

//   // hereglegcheer zahialga avah
//   async getOrdersByUser(user_id) {
//     const result = await pool.query(
//       `SELECT * FROM ${this.#tableName} WHERE user_id=$1 ORDER BY id DESC`,
//       [user_id]
//     );
//     return result.rows;
//   }

//   // zahialga uusgeh
//   async createOrder(dto) {
//     const { user_id, total_amount, shipping_address, payment_id, status = 'pending' } = dto;
//     const result = await pool.query(
//       `INSERT INTO ${this.#tableName} 
//        (user_id, total_amount, shipping_address, payment_id, status)
//        VALUES ($1,$2,$3,$4,$5) RETURNING *`,
//       [user_id, total_amount, shipping_address, payment_id, status]
//     );
//     return result.rows[0];
//   }

//   // zahialga ID aar avah
//   async getOrderById(id) {
//     const result = await pool.query(
//       `SELECT * FROM ${this.#tableName} WHERE id=$1`,
//       [id]
//     );
//     return result.rows[0];
//   }

//   // zahialga shinechleh
//   async updateOrder(id, dto) {
//     const { status, shipping_address, total_amount, payment_id } = dto;
//     const result = await pool.query(
//       `UPDATE ${this.#tableName} 
//        SET status = COALESCE($1, status),
//            shipping_address = COALESCE($2, shipping_address),
//            total_amount = COALESCE($3, total_amount),
//            payment_id = COALESCE($4, payment_id)
//        WHERE id=$5 RETURNING *`,
//       [status, shipping_address, total_amount, payment_id, id]
//     );
//     return result.rows[0];
//   }

//   // zahialga uusgeh
//   async deleteOrder(id) {
//     const result = await pool.query(
//       `DELETE FROM ${this.#tableName} WHERE id=$1 RETURNING *`,
//       [id]
//     );
//     return result.rows[0];
//   }
// }

// module.exports = Order;


// models/Order.js
const { pool } = require("../db");

class OrderModel {
  #table = "orders";

  // list orders (optionally by user, status, pagination)
  async getAll({ page = 0, limit = 10, user_id, status } = {}) {
    const offset = page * limit;
    const params = [];
    let i = 1;

    let q = `
      SELECT
        id,
        user_id,
        order_number,
        status,
        order_date,
        shipping_address_id,
        billing_address_id,
        subtotal_amount,
        shipping_amount,
        tax_amount,
        discount_amount,
        total_amount
      FROM ${this.#table}
      WHERE 1=1
    `;

    if (user_id) {
      q += ` AND user_id = $${i++}`;
      params.push(user_id);
    }

    if (status) {
      q += ` AND status = $${i++}`;
      params.push(status);
    }

    q += ` ORDER BY order_date DESC NULLS LAST LIMIT $${i} OFFSET $${i + 1}`;
    params.push(limit, offset);

    const res = await pool.query(q, params);
    return res.rows;
  }

  // one order + items + payments + shipment
  async getById(id) {
    // main order
    const orderRes = await pool.query(
      `
      SELECT
        id,
        user_id,
        order_number,
        status,
        order_date,
        shipping_address_id,
        billing_address_id,
        subtotal_amount,
        shipping_amount,
        tax_amount,
        discount_amount,
        total_amount
      FROM ${this.#table}
      WHERE id = $1
      `,
      [id]
    );
    const order = orderRes.rows[0];
    if (!order) return null;

    // items
    const itemsRes = await pool.query(
      `
      SELECT
        order_id,
        product_id,
        product_name,
        unit_price,
        quantity
      FROM order_items
      WHERE order_id = $1
      ORDER BY product_name
      `,
      [id]
    );

    // payments
    const payRes = await pool.query(
      `
      SELECT
        *
      FROM payments
      WHERE order_id = $1
      ORDER BY id DESC
      `,
      [id]
    );

    // shipment (maybe 0 or 1)
    const shipRes = await pool.query(
      `
      SELECT *
      FROM shipments
      WHERE order_id = $1
      ORDER BY id DESC
      `,
      [id]
    );

    return {
      ...order,
      items: itemsRes.rows,
      payments: payRes.rows,
      shipments: shipRes.rows,
    };
  }

  // create base order (no items here – items can be inserted separately or in controller)
  async create(dto) {
    let {
      user_id,
      order_number,
      status,
      order_date,
      shipping_address_id,
      billing_address_id,
      subtotal_amount = 0,
      shipping_amount = 0,
      tax_amount = 0,
      discount_amount = 0,
      total_amount, // keep misspelling to match DB
    } = dto;

    if (!user_id) throw new Error("user_id is required");

    if (!order_number) {
      order_number = "ORD-" + Date.now();
    }

    if (total_amount == null) {
      total_amount =
        Number(subtotal_amount) +
        Number(shipping_amount) +
        Number(tax_amount) -
        Number(discount_amount);
    }

    const res = await pool.query(
      `
      INSERT INTO ${this.#table} (
        user_id,
        order_number,
        status,
        order_date,
        shipping_address_id,
        billing_address_id,
        subtotal_amount,
        shipping_amount,
        tax_amount,
        discount_amount,
        total_amount
      )
      VALUES ($1, $2, $3, COALESCE($4, NOW()), $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
      `,
      [
        user_id,
        order_number,
        status || "pending",
        order_date || null,
        shipping_address_id || null,
        billing_address_id || null,
        subtotal_amount,
        shipping_amount,
        tax_amount,
        discount_amount,
        total_amount,
      ]
    );

    return res.rows[0];
  }

  // update order (status, addresses, amounts)
  async update(id, dto) {
    const existing = await this.getById(id);
    if (!existing) return null;

    const {
      status,
      shipping_address_id,
      billing_address_id,
      subtotal_amount,
      shipping_amount,
      tax_amount,
      discount_amount,
      total_amount,
    } = dto;

    const res = await pool.query(
      `
      UPDATE ${this.#table}
      SET
        status = COALESCE($1, status),
        shipping_address_id = COALESCE($2, shipping_address_id),
        billing_address_id = COALESCE($3, billing_address_id),
        subtotal_amount = COALESCE($4, subtotal_amount),
        shipping_amount = COALESCE($5, shipping_amount),
        tax_amount = COALESCE($6, tax_amount),
        discount_amount = COALESCE($7, discount_amount),
        total_amount = COALESCE($8, total_amount)
      WHERE id = $9
      RETURNING *
      `,
      [
        status || null,
        shipping_address_id || null,
        billing_address_id || null,
        subtotal_amount !== undefined ? subtotal_amount : null,
        shipping_amount !== undefined ? shipping_amount : null,
        tax_amount !== undefined ? tax_amount : null,
        discount_amount !== undefined ? discount_amount : null,
        total_amount !== undefined ? total_amount : null,
        id,
      ]
    );

    return res.rows[0];
  }

  async delete(id) {
    const res = await pool.query(
      `DELETE FROM ${this.#table} WHERE id = $1 RETURNING *`,
      [id]
    );
    return res.rows[0];
  }
  async getByStatus(status, { page = 0, limit = 10 } = {}) {
    const offset = page * limit;
    const res = await pool.query(
      `
      SELECT
        id,
        user_id,
        order_number,
        status,
        order_date,
        shipping_address_id,
        billing_address_id,
        subtotal_amount,
        shipping_amount,
        tax_amount,
        discount_amount,
        total_amount
      FROM ${this.#table}
      WHERE status = $1
      ORDER BY order_date DESC NULLS LAST
      LIMIT $2 OFFSET $3
      `,
      [status, limit, offset]
    );
    return res.rows;
  }
}

module.exports = new OrderModel();
