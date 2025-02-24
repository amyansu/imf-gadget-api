import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import express from 'express';
import { gadgetsTable, usersTable } from './db/schema.js';
import { generate } from 'random-words';
import { and, eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const app = express();
const port = 3000;

app.use(express.json());

const db = drizzle(process.env.DATABASE_URL);

const secretKey = process.env.JWT_SECRET;

const generateJwt = (user) => {
    const payload = { username: user.username };
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

const userAuthenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, secretKey, (error, user) => {
            if (error) {
                return res.status(403).json({ error: error.message });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(403).json({ message: "Admin authentication failed" });
    }
}

// create signup route
app.post('/gadgets/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await db.select().from(usersTable).where(eq(usersTable.username, username));
        if (existingUser.length > 0) {
            res.status(403).json({ message: 'User already exists' });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.insert(usersTable).values({ username, password: hashedPassword }).returning();
            const token = generateJwt({ username });
            res.json({ message: "User created successfully", token });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// create signin route
app.post('/gadgets/signin', async (req, res) => {
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

// Get all gadgets
app.get('/gadgets', userAuthenticate, async (req, res) => {
    try {
        const allGadgets = await db.select().from(gadgetsTable);
        const gadgetsWithProbability = allGadgets.map(gadget => ({
            ...gadget,
            probability: `${Math.floor(Math.random() * 100) + 1}% success probability`
        }));
        res.status(200).json({ gadgets: gadgetsWithProbability });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new gadget
app.post('/gadgets/add', userAuthenticate, async (req, res) => {
    try {
        const addNewGadget = await db.insert(gadgetsTable).values({
            name: 'The ' + generate(),
        }).returning();
        res.status(201).json(addNewGadget);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a gadget by ID
app.patch('/gadgets/update/:id', userAuthenticate, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updatedGadget = await db.update(gadgetsTable)
            .set({ status, decommissioned_at: null })
            .where(eq(gadgetsTable.id, id))
            .returning();
        res.status(200).json(updatedGadget);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete (decommission) a gadget by ID
app.delete('/gadgets/delete/:id', userAuthenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const decommissionedAt = new Date();
        const updatedGadget = await db.update(gadgetsTable)
            .set({
                status: 'Decommissioned',
                decommissioned_at: decommissionedAt
            })
            .where(eq(gadgetsTable.id, id))
            .returning();

        res.status(200).json(updatedGadget);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
