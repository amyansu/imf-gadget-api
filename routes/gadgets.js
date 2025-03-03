import { eq } from 'drizzle-orm';
import express from 'express';
import { generate } from 'random-words';
import { userAuthenticate } from '../middleware/auth.js';
import { db } from '../db/index.js';
import { gadgetsTable } from '../db/schema.js';
const router = express.Router();

// Get all gadgets
router.get('/', userAuthenticate, async (req, res) => {
    try {
        const allGadgets = await db.select().from(gadgetsTable).where(eq(gadgetsTable.userId, req.user.id));
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
router.post('/add', userAuthenticate, async (req, res) => {
    try {
        const addNewGadget = await db.insert(gadgetsTable).values({
            name: 'The ' + generate(),
            userId: req.user.id
        }).returning();
        res.status(201).json(addNewGadget);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a gadget by ID
router.patch('/update/:id', userAuthenticate, async (req, res) => {
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
router.delete('/delete/:id', userAuthenticate, async (req, res) => {
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

export default router;
