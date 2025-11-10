const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ROLES } = require("../middleware/roleGuard");

const SECRET_KEY = "supersecret";

async function register(req, res) {
  try {
    const { username, email, phone, password } = req.body;
    if (!username || !email || !phone || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Бүх талбарыг бөглөнө үү (username, email, phone, password)" 
      });
    }

  
    if (password.length < 3) {
      return res.status(400).json({ 
        success: false, 
        message: "Нууц үг хамгийн багадаа 3 тэмдэгт байх ёстой" 
      });
    }

    const roleToSet = ROLES.USER;

    const existing = await User.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ 
        success: false,
        message: "Ийм email-тай хэрэглэгч аль хэдийн байна" 
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.createUser({ 
      username, 
      email, 
      phone, 
      password: hash, 
      role: roleToSet 
    });

    res.json({ success: true, user: newUser });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

  
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email болон нууц үгээ оруулна уу" 
      });
    }

    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: "Email эсвэл нууц үг буруу" 
      });
    }
    console.log(password, user);

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ 
        success: false,
        message: "Email эсвэл нууц үг буруу" 
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1d" });

    res.json({ success: true, token, user });
  } catch (err) {
    console.error("Login error:", err); 
    res.status(500).json({ success: false, message: err.message });
  }
}

async function profile(req, res) {
  try {
    const user = await User.getUserById(req.user.id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function resetPassword(req, res) {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Email болон шинэ нууц үг шаардлагатай" 
      });
    }

    if (newPassword.length < 3) {
      return res.status(400).json({ 
        success: false, 
        message: "Нууц үг хамгийн багадаа 3 тэмдэгт байх ёстой" 
      });
    }

    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "Хэрэглэгч олдсонгүй" 
      });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(user.id, hash);

    res.json({ 
      success: true, 
      message: "Нууц үг амжилттай солигдлоо" 
    });

  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { 
  register, 
  login, 
  profile, 
  resetPassword
};