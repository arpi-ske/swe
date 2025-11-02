// const User = require("../models/User");

// async function getAllUsers(req, res) {
//   try {
//     const users = await User.getAllUsers();
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to get users" });
//   }
// }

// async function getUserById(req, res) {
//   try {
//     const user = await User.getUserById(req.params.id);
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to get user" });
//   }
// }

// async function updateUser(req, res) {
//   try {
//     const updated = await User.updateUser(req.params.id, req.body);
//     if (!updated) return res.status(404).json({ message: "User not found" });
//     res.json(updated);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to update user" });
//   }
// }

// async function deleteUser(req, res) {
//   try {
//     const deleted = await User.deleteUser(req.params.id);
//     if (!deleted) return res.status(404).json({ message: "User not found" });
//     res.json({ message: "User deleted", deleted });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to delete user" });
//   }
// }

// module.exports = { getAllUsers, getUserById, updateUser, deleteUser };



// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const User = require('../models/User');

// const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// async function register(req, res) {
//     try {
//         const { username, password, email, role, phone } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);
//         let user = await User.getUserByPhone(phone);
//         if (user) {
//             res.status(500).json({ message: "User already exists" });
//             return;
//         }
//         user = await User.createUser({
//             username,
//             email,
//             phone,
//             password: hashedPassword,
//             role: 10 });

//         res.status(201).json(user);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message:
//              "Registration failed" });
//     }
// }

// async function login(req, res) {
//     try { 
//         const { phone, password} = req.body;
//         const user = await User.getUserByPhone(phone);

//         if (!user) return res.status(401).json({ message: "User not found" });

//         const isMAtch = await bcrypt.compare(password, user.password);
//         if (!isMAtch)
//         return res.status(401).json({ message: "Invalid credentials" });

//         const token = jwt.sign(
//             {id: user.id, username: user.username, role: user.role},
//             JWT_SECRET,
//             {expiresIn: '1h'}
//         );

//         res.json({ token });
//     } catch (error) {
//         console.error(err);
//         res.status(500).json({ message: "Login failed" });  
//     }
// }

// async function profile(req, res) {
//     try { 
//         const user = await User.getUserById(req.user.id);
//         res.json(user);
//     } catch (err) {
//         req.status(500).json({ message: "Failed to fetch profile" });
//     }
// }

// module.exports = {
//     register,
//     login,
//     profile,
// };

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { ROLES } = require("../middleware/roleGuard");

const SECRET_KEY = "your_secret_key";

// Register
async function register(req, res) {
  try {
    const { username, email, phone, password, role } = req.body;

    const existing = await User.getUserByEmail(email);
    if (existing) return res.status(400).json({ message:"Ийм email-тай хэрэглэгч аль хэдийн байна" });

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.createUser({ username, email, phone, password_hash: hash, role });

    res.json({ success:true, user: newUser });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
}

// Login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.getUserByEmail(email);
    if (!user) return res.status(400).json({ message:"Email эсвэл нууц үг буруу" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ message:"Email эсвэл нууц үг буруу" });

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn:"1d" });

    res.json({ success:true, token, user });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
}

// Profile
async function profile(req, res) {
  try {
    const user = await User.getUserById(req.user.id);
    res.json({ success:true, user });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
}

module.exports = { register, login, profile };
