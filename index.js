import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import express from 'express';
import { gadgetsTable } from './db/schema.js';
import { generate } from 'random-words';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3000;

app.use(express.json());

const db = drizzle(process.env.DATABASE_URL);

let USERS = [];

const secretKey = process.env.JWT_SECRET;

const generateJwt = (user) => {
    const payload = { username: user.username };
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

const userAuthenticate = (req, res, next) => {
const authHeader = req.headers.authorization;
if (authHeader){
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey, (error, user)=>{
        if (error){
            return res.status(403).json({ error: error.message })
        }
        req.user = user;
        next();
    })
}
else{
    return res.status(403).json({message:"Admin authentication failed" })
}
}

// create signup route
app.post('/gadgets/signup', (req, res) => {
    const user = req.body;
    const existingUser = USERS.find(u => u.username === user.username);
    if (existingUser) {
        res.status(403).json({ message: 'user already exist' })
    } else {
        USERS.push(user);
        const token = generateJwt(user);
        res.json({ message: 'User created successfully', token })
    }
})

// create signin route
app.post('/gadgets/signin', (req, res) => {
    const { username, password } = req.headers;
    const user = USERS.find(u => u.username === username && u.password === password)
    if (user) {
        const token = generateJwt(user);
        res.json({ message: "Logged in successfully", token })
    }
    else {
        res.status(403).json({ message: "User authentication failed" })
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
app.post('/gadgets/add', async (req, res) => {
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
app.patch('/gadgets/update/:id', async (req, res) => {
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
app.delete('/gadgets/delete/:id', async (req, res) => {
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
        console.log(error)
        res.status(500).json({
            error: error.message
        });
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
