const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

async function register(req, res) {
    try {
        const { username, password, email, role, phone } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        let user = await User.getUserByPhone(phone);
        if (user) {
            res.status(500).json({ message: "User already exists" });
            return;
        }
        user = await User.createUser({
            username,
            email,
            phone,
            password: hashedPassword,
            role: 10 });

        res.status(201).json(user);
    } catch (error) {
        console.error(err);
        res.status(500).json({ message:
             "Registration failed" });
    }
}

async function login(req, res) {
    try { 
        const { phone, password} = req.body;
        const user = await User.getUserByPhone(phone);

        if (!user) return res.status(401).json({ message: "User not found" });

        const isMAtch = await bcrypt.compare(password, user.password);
        if (!isMAtch)
        return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            {id: user.id, username: user.username, role: user.role},
            JWT_SECRET,
            {expiresIn: '1h'}
        );

        res.json({ token });
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: "Login failed" });  
    }
}

async function profile(req, res) {
    try { 
        const user = await User.getUserById(req.user.id);
        res.json(user);
    } catch (err) {
        req.status(500).json({ message: "Failed to fetch profile" });
    }
}

module.exports = {
    register,
    login,
    profile,
};