import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ msg: "Invalid credentials" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, email, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashed, role: "admin" });
    await admin.save();

    res.status(201).json({ msg: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
