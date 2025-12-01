const { pool } = require("../db");

class CartModel {
  async getOrCreateCart(userId) {
    try {
      const existing = await pool.query(
        `SELECT id FROM carts WHERE user_id = $1`,
        [userId]
      );
      if (existing.rows.length) return existing.rows[0];

      const inserted = await pool.query(
        `INSERT INTO carts (user_id, created_at) VALUES ($1, NOW()) RETURNING id`,
        [userId]
      );
      return inserted.rows[0];
    } catch (err) {
      throw new Error(`getOrCreateCart error: ${err.message}`);
    }
  }

  async getCartItems(userId) {
    try {
      const res = await pool.query(
        `
        SELECT
          ci.cart_id,
          ci.product_id,
          ci.quantity,
          p.name AS product_name,
          p.price
        FROM carts c
        JOIN cart_items ci ON ci.cart_id = c.id
        JOIN products p ON p.id = ci.product_id
        WHERE c.user_id = $1
        ORDER BY ci.product_id DESC
        `,
        [userId]
      );
      return res.rows;
    } catch (err) {
      throw new Error(`getCartItems error: ${err.message}`);
    }
  }

  async addItem(userId, productId, quantity = 1) {
    try {
      const cart = await this.getOrCreateCart(userId);

      const existing = await pool.query(
        `SELECT quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
        [cart.id, productId]
      );

      if (existing.rows.length) {
        const newQty = existing.rows[0].quantity + quantity;
        await pool.query(
          `UPDATE cart_items
           SET quantity = $1
           WHERE cart_id = $2 AND product_id = $3`,
          [newQty, cart.id, productId]
        );
        return { cart_id: cart.id, product_id: productId, quantity: newQty };
      }

      await pool.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity)
         VALUES ($1, $2, $3)`,
        [cart.id, productId, quantity]
      );

      return { cart_id: cart.id, product_id: productId, quantity };
    } catch (err) {
      throw new Error(`addItem error: ${err.message}`);
    }
  }

  async updateItem(userId, productId, quantity) {
    try {
      const cart = await this.getOrCreateCart(userId);
      const res = await pool.query(
        `UPDATE cart_items
         SET quantity = $1
         WHERE cart_id = $2 AND product_id = $3
         RETURNING cart_id, product_id, quantity`,
        [quantity, cart.id, productId]
      );
      return res.rows[0];
    } catch (err) {
      throw new Error(`updateItem error: ${err.message}`);
    }
  }

  async removeItem(userId, productId) {
    try {
      const cart = await this.getOrCreateCart(userId);
      const res = await pool.query(
        `DELETE FROM cart_items
         WHERE cart_id = $1 AND product_id = $2
         RETURNING cart_id, product_id`,
        [cart.id, productId]
      );
      return res.rows[0];
    } catch (err) {
      throw new Error(`removeItem error: ${err.message}`);
    }
  }

  async clearCart(userId) {
    try {
      const cart = await this.getOrCreateCart(userId);
      await pool.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cart.id]);
    } catch (err) {
      throw new Error(`clearCart error: ${err.message}`);
    }
  }

  // -----------------------------
  // 🔥 ADMIN: бүх хэрэглэгчийн cart авах
  // -----------------------------
  async getAllCarts() {
    try {
      const carts = await pool.query(`
        SELECT 
          c.id AS cart_id,
          c.user_id,
          c.created_at,
          c.updated_at,
          COALESCE(o.id, NULL) AS order_id
        FROM carts c
        LEFT JOIN orders o ON o.cart_id = c.id
        ORDER BY c.user_id;
      `);
      return carts.rows;
    } catch (err) {
      throw new Error(`getAllCarts error: ${err.message}`);
    }
  }

  async getItemsByCartIds(cartIds) {
    try {
      if (!cartIds || cartIds.length === 0) return [];

      const items = await pool.query(
        `
        SELECT 
          ci.cart_id,
          ci.product_id,
          ci.quantity,
          p.name AS product_name,
          p.price
        FROM cart_items ci
        LEFT JOIN products p ON p.id = ci.product_id
        WHERE ci.cart_id = ANY($1)
        ORDER BY ci.cart_id, ci.product_id
        `,
        [cartIds]
      );

      return items.rows;
    } catch (err) {
      throw new Error(`getItemsByCartIds error: ${err.message}`);
    }
  }
}

module.exports = new CartModel();
