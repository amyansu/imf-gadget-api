import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import express from 'express';
import { gadgetsTable } from './db/schema.js';
import { generate } from 'random-words';
import { eq } from 'drizzle-orm';

const app = express();
const port = 3000;

app.use(express.json());

const db = drizzle(process.env.DATABASE_URL);

// Get all gadgets
app.get('/gadgets', async (req, res) => {
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
