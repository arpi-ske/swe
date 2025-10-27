// const { pool } = require('../db');
// const tableName = 'products';

// async function getAllProducts() {
//     const result = await pool.query(`SELECT * FROM ${tableName}`);
//     return result.rows;
// }

// async function getProductById(id) {
//     const result = await pool.query(`SELECT * FROM ${tableName} WHERE id = ${id} `);
//     return result.rows[0];
// }

// async function createProduct(dto) {
//     const { 
//         name, price, description, stock, brand_id, category_id, discount_id, 
//         brand_name, category_name, quantity, type, color, size, status, created_at 
//     } = dto;
//     const result = await pool.query(
//         `INSERT INTO products 
//         (name, price, description, stock, brand_id, category_id, discount_id, brand_name, category_name, quantity, type, color, size, status, created_at)
//         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
//         RETURNING *`,
//         [name, price, description, stock, brand_id, category_id, discount_id, brand_name, category_name, quantity, type, color, size, status, created_at]
//     );

//     return result.rows[0];
// }

// async function updateProduct(id, dto) {    
//     const { 
//         name, price, description, stock, brand_id, category_id, discount_id, 
//         brand_name, category_name, quantity, type, color, size, status, created_at 
//     } = dto;

//     const result = await pool.query(
//         `UPDATE products SET 
//             name=$1, price=$2, description=$3, stock=$4, brand_id=$5, category_id=$6, discount_id=$7,
//             brand_name=$8, category_name=$9, quantity=$10, type=$11, color=$12, size=$13, status=$14, created_at=$15
//          WHERE id=$16
//          RETURNING *`,
//         [name, price, description, stock, brand_id, category_id, discount_id,
//          brand_name, category_name, quantity, type, color, size, status, created_at, id]
//     );

//     return result.rows[0];
// }

// async function deleteProduct(id) {
//     const result = await pool.query(
//         `DELETE FROM products WHERE id=$1 RETURNING *`,
//         [id]
//     );
//     return result.rows[0];
// }


// module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };

const { pool } = require('../db');
class Product {
    #tableName = "products";
    async getAllProducts({limit, page}) {
        const result = await pool.query(
        `SELECT * FROM ${
        this.#tableName
      }  LIMIT ${limit} OFFSET ${page} * ${limit}`
    );
    return result.rows;
    }
    async getProductById(id) {
        const result = await pool.query
        (`SELECT * FROM ${this.#tableName} WHERE id = $1`, [id]);
        return result.rows[0];
    }
    async getProductByName(name) {
        const result = await pool.query
        (`SELECT * FROM ${this.#tableName} WHERE lower(name) = $1`,
        [name.toLowerCase()]);
        return result.rows[0];
    }
    async createProduct(dto) {
    const { name, price, quantity } = dto;
    if (price <= 0) throw new Error("үнийн дүн 0-с их байх ёстой", 400);

    const product = await this.getProductByName(name);
    if (product) throw new Error("Бүртгэлтэй бүтээгдэхүүн", 400);
    const result = await pool.query(
      `INSERT INTO ${this.#tableName} (name, price, quantity)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, price, quantity]
    );
    return result.rows[0];
  }
  async updateProduct(id, dto) {
    const { name, price, quantity } = dto;
    const product = await this.getProductById(id);
    if (!product) return null;

    const result = await pool.query(
      `UPDATE ${this.#tableName} SET name=$1, price=$2, quantity=$3
       WHERE id=$4 RETURNING *`,
      [name || product.name, price || product.price, quantity || product.quantity, id]
    );
    return result.rows[0];
  }
  async deleteProduct(id) {
    const result = await pool.query(
      `DELETE FROM ${this.#tableName} WHERE id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Product;
