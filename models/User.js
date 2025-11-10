const { pool } = require("../db");
const tableName = "users";

async function getAllUsers() {
  const result = await pool.query(`SELECT * FROM ${tableName}`);
  return result.rows;
}

async function getUserById(id) {
  const result = await pool.query(`SELECT * FROM ${tableName} WHERE id = $1`, [
    id,
  ]);
  return result.rows?.[0];
}

async function getUserByPhone(phone) {
  const result = await pool.query(
    `SELECT * FROM ${tableName} WHERE phone = $1`,
    [phone]
  );
  return result.rows?.[0];
}

async function createUser(dto) {
  const { username, password, email, role, phone } = dto;
  const result = await pool.query(
    `INSERT INTO ${tableName} (username, password, phone, email, role)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [username, password, phone, email, role || 10]
  );
  return result.rows[0];
}

async function updateUser(id, dto) {
  const { username, password, email, role, phone } = dto;
  const user = await getUserById(id);
  if (!user) return null;

  const result = await pool.query(
    `UPDATE ${tableName} SET username=$1, password=$2, phone=$3, email=$4, role=$5, updated_at=CURRENT_TIMESTAMP
     WHERE id=$6 RETURNING *`,
    [
      username || user.username,
      password || user.password,
      phone || user.phone,
      email || user.email,
      role || user.role,
      id,
    ]
  );
  return result.rows[0];
}

async function updatePassword(userId, newPasswordHash) {
  const result = await pool.query(
    `UPDATE ${tableName} SET password = $1, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $2 RETURNING id, username, email, phone, role`,
    [newPasswordHash, userId]
  );
  return result.rows[0];
}

async function deleteUser(id) {
  const result = await pool.query(
    `DELETE FROM ${tableName} WHERE id=$1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

async function getUserByEmail(email) {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows?.[0];
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByPhone,
  getUserByEmail,
  createUser,
  updateUser,
  updatePassword,
  deleteUser,
};