const { pool } = require("../db");

const tableName = "brands";

// buh branduudiig avah
async function getAllBrands({ limit = 10, page = 0 } = {}) {
  const offset = page * limit;
  const result = await pool.query(
    `SELECT * FROM ${tableName} 
     ORDER BY created_at DESC 
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
}

// id aar brand avah
async function getBrandById(id) {
  const result = await pool.query(
    `SELECT * FROM ${tableName} WHERE id = $1`,
    [id]
  );
  return result.rows?.[0];
}

// nereer brand haih
async function getBrandByName(name) {
  const result = await pool.query(
    `SELECT * FROM ${tableName} WHERE LOWER(name) = LOWER($1)`,
    [name]
  );
  return result.rows?.[0];
}

// shine brand uusgeh
async function createBrand(dto) {
  const { name, description } = dto;

  if (!name || name.trim().length === 0) {
    throw new Error("Брэндийн нэр хоосон байж болохгүй");
  }

  // dawhardsan ner shalgah
  const existing = await getBrandByName(name);
  if (existing) {
    throw new Error("Ийм нэртэй брэнд аль хэдийн бүртгэлтэй байна");
  }

  const result = await pool.query(
    `INSERT INTO ${tableName} (name, description, created_at, updated_at) 
     VALUES ($1, $2, NOW(), NOW()) 
     RETURNING *`,
    [name.trim(), description || null]
  );

  return result.rows[0];
}

// brand shinechleh
async function updateBrand(id, dto) {
  const { name, description } = dto;

  // brand bga esehiig shalgah
  const existing = await getBrandById(id);
  if (!existing) {
    return null;
  }

  // herew ner uurchlugdsun bol dawhardsan esehiig shalgah
  if (name && name !== existing.name) {
    const duplicate = await getBrandByName(name);
    if (duplicate && duplicate.id !== parseInt(id)) {
      throw new Error("Ийм нэртэй брэнд аль хэдийн бүртгэлтэй байна");
    }
  }

  const result = await pool.query(
    `UPDATE ${tableName} 
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [
      name?.trim() || null,
      description !== undefined ? description : null,
      id
    ]
  );

  return result.rows[0];
}

// ustgah
async function deleteBrand(id) {
  // bga esehiig shalgah
  const existing = await getBrandById(id);
  if (!existing) {
    return null;
  }

  // buteegdehuun bga esehiig shalgah
  const productsCheck = await pool.query(
    `SELECT COUNT(*) as count FROM products WHERE brand_id = $1`,
    [id]
  );

  if (parseInt(productsCheck.rows[0].count) > 0) {
    throw new Error("Энэ брэндийн бүтээгдэхүүн байгаа тул устгах боломжгүй");
  }

  const result = await pool.query(
    `DELETE FROM ${tableName} WHERE id = $1 RETURNING *`,
    [id]
  );

  return result.rows[0];
}

// brandiin buteegdehuuniin too avah
async function getBrandProductCount(id) {
  const result = await pool.query(
    `SELECT COUNT(*) as product_count FROM products WHERE brand_id = $1`,
    [id]
  );
  return parseInt(result.rows[0].product_count);
}

module.exports = {
  getAllBrands,
  getBrandById,
  getBrandByName,
  createBrand,
  updateBrand,
  deleteBrand,
  getBrandProductCount,
};
