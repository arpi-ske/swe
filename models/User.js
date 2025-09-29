const { pool } = require('../db');
const tableName = "users";

const getUsers = async (req, res) => {
    const resutl = await pool.query(`SELECT * FROM ${tableName}`);
    return result.rows;
};

async function getUserById(id) {
    const result = await pool.query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
    return result.rows?.[0];
}

async function getUserByPhone(phone) {
    const result = await pool.query(`SELECT * FROM ${tableName} WHERE phone = $1`, 
    [phone]);
    return result.rows?.[0];
}

async function createUser(dto) {
    const { username, password, email, role, phone } = dto;
    const result = await pool.query(
        `INSERT INTO ${tableName} (username, password, email, role, phone) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [username, password, phone, email, role || 10]
    );
    return result.rows?.[0];
}

module.exports = {
    getUsers,
    getUserById,
    getUserByPhone,
    createUser,
};