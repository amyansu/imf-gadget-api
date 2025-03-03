import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { usersTable } from '../db/schema.js';
import { db } from '../db/index.js';
import { secretKey } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT Token
const generateJwt = (user) => {
    const payload = {id: user.id, username: user.username};
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

// create signup route
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await db.select().from(usersTable).where(eq(usersTable.username, username));
        if (existingUser.length > 0) {
            res.status(403).json({ message: 'User already exists' });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await db.insert(usersTable).values({ username, password: hashedPassword }).returning();
            const token = generateJwt({ id: user[0].id, username: user[0].username });
            res.json({ message: "User created successfully", token });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// create signin route
router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await db.select().from(usersTable).where(eq(usersTable.username, username));
        if (user.length > 0 && await bcrypt.compare(password, user[0].password)) {
            const token = generateJwt(user[0]);
            res.json({ message: "Logged in successfully", token });
        } else {
            res.status(403).json({ message: "User authentication failed" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
