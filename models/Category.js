const { pool } = require('../db');
const tableName = 'categories';
async function getAllCategories() {
    const result = await pool.query(`SELECT * FROM ${tableName}`);
    return result.rows;
}

async function getCategoryById(id) {
    const result = await pool.query(`SELECT * FROM ${tableName} WHERE id = ${id} `);
    return result.rows[0];
}

async function createCategory(dto) {
    const { name, description, photo } = dto;
    const result = await pool.query(`INSERT INTO ${tableName} (name, description, photo) VALUES ($1, $2, $3) RETURNING *`, [name, description, photo]);
    return result.rows[0];
}
async function updateCategory(id, dto) {    
    const { name, description, photo } = dto;
    const result = await pool.query(`UPDATE ${tableName} SET name=$1, description=$2, photo=$3 WHERE id=$4 RETURNING *`, [name, description, photo, id]);
    return result.rows[0];
}
async function deleteCategory(id) {
    const result = await pool.query(`DELETE FROM ${tableName} WHERE id=$1 RETURNING *`, [id]);
    return result.rows[0];
}

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };