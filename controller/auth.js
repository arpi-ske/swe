// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");


// async function register(req, res) {
//   try {
//     const { username, password, email, role, phone } = req.body;

//     // burtgeltei esehiig shalgah
//     const existingUser = await User.getUserByPhone(phone);
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // nuuts ug encryptleh
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // role default 10 bolgoj hereglegch uusgeh
//     const newUser = await User.createUser({
//       username,
//       password: hashedPassword,
//       email,
//       phone,
//       role: role || 10,
//     });

//     res.status(201).json({
//       message: "Registration successful",
//       user: newUser,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Registration failed" });
//   }
// }


// async function login(req, res) {
//   try {
//     const { phone, password } = req.body;

//     const user = await User.getUserByPhone(phone);
//     if (!user) return res.status(400).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(400).json({ message: "Incorrect password" });

//     // JWT uusgeh
//     const token = jwt.sign(
//       { id: user.id, role: user.role },
//       process.env.JWT_SECRET || "secret",
//       { expiresIn: "1d" }
//     );

//     res.json({
//       message: "Login successful",
//       token,
//       user: { id: user.id, username: user.username, role: user.role },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Login failed" });
//   }
// }

// // nuuts ug sergeeh
// async function resetPassword(req, res) {
//   try {
//     const { phone, newPassword } = req.body;

//     const user = await User.getUserByPhone(phone);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const hashed = await bcrypt.hash(newPassword, 10);
//     const updatedUser = await User.updateUser(user.id, {
//       password: hashed,
//     });

//     res.json({ message: "Password updated successfully", updatedUser });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Password reset failed" });
//   }
// }

// module.exports = { register, login, resetPassword };
