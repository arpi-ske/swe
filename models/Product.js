const { pool } = require('../db');

class Product {
  #tableName = "products";

  // buh buteegdehuuniig avah (attribute haruulahgui)
  async getAllProducts({ limit = 10, page = 0 } = {}) {
    const offset = page * limit;
    const result = await pool.query(
      `SELECT id, name, price, quantity, description 
       FROM ${this.#tableName} 
       ORDER BY id DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  // id aar buteegdehuun avah (attribute hargduulah)
  async getProductById(id) {
    const result = await pool.query(
      `SELECT * FROM ${this.#tableName} WHERE id=$1`,
      [id]
    );
    return result.rows[0];
  }

  // --- Attributes-г тухайн бүтээгдэхүүнээс авах ---
  async getAttributesByProductId(productId) {
    const result = await pool.query(`
      SELECT a.name AS attribute_name, av.value AS attribute_value
      FROM product_attributes pa
      JOIN attributes a ON pa.attribute_id = a.id
      JOIN attribute_values av ON pa.attribute_value_id = av.id
      WHERE pa.product_id = $1
    `, [productId]);

    return result.rows.map(r => ({
      name: r.attribute_name,
      value: r.attribute_value
    }));
  }

  // shine buteegdehuun uusgeh
  async createProduct(dto) {
    const { name, price, quantity, description, attributes } = dto;

    if (price <= 0) throw new Error("Үнийн дүн 0-с их байх ёстой");

    // ner dawhardsan esehiig shalgah
    const existing = await pool.query(`SELECT id FROM ${this.#tableName} WHERE LOWER(name) = $1`, [name.toLowerCase()]);
    if (existing.rows.length > 0) throw new Error("Бүртгэлтэй бүтээгдэхүүн");

    // buteegdehuun uusgeh
    const result = await pool.query(
      `INSERT INTO ${this.#tableName} (name, price, quantity, description)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, price, quantity, description || null]
    );
    const newProduct = result.rows[0];

    // attribute nemeh
    if (attributes && attributes.length > 0) {
      for (const attr of attributes) {
        // attribute shalgah, uusgeh
        let attrRes = await pool.query(`SELECT id FROM attributes WHERE name=$1`, [attr.name]);
        let attributeId;
        if (attrRes.rows.length === 0) {
          attrRes = await pool.query(`INSERT INTO attributes (name) VALUES ($1) RETURNING id`, [attr.name]);
        }
        attributeId = attrRes.rows[0].id;

        // attribute value shalgah, uusgeh
        let valRes = await pool.query(`SELECT id FROM attribute_values WHERE attribute_id=$1 AND value=$2`, [attributeId, attr.value]);
        let valueId;
        if (valRes.rows.length === 0) {
          valRes = await pool.query(`INSERT INTO attribute_values (attribute_id, value) VALUES ($1, $2) RETURNING id`, [attributeId, attr.value]);
        }
        valueId = valRes.rows[0].id;

        // product attribute holboos
        await pool.query(`INSERT INTO product_attributes (product_id, attribute_id, attribute_value_id) VALUES ($1, $2, $3)`,
          [newProduct.id, attributeId, valueId]);
      }
    }

    return newProduct;
  }

  // buteegdehuun shinechleh
  async updateProduct(id, dto) {
    const { name, price, quantity, description } = dto;
    const product = await this.getProductById(id);
    if (!product) return null;

    const result = await pool.query(
      `UPDATE ${this.#tableName}
       SET name=$1, price=$2, quantity=$3, description=$4
       WHERE id=$5 RETURNING *`,
      [name || product.name, price || product.price, quantity || product.quantity, description || product.description, id]
    );
    return result.rows[0];
  }

  //  buteegdehuun ustgah
  async deleteProduct(id) {
    const result = await pool.query(
      `DELETE FROM ${this.#tableName} WHERE id=$1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Product;
