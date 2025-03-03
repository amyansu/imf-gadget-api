import express from 'express';
import authRoutes from "./routes/auth.js";
import gadgetRoutes from "./routes/gadgets.js";

// Express app setup
const app = express();
const port = 3000;
app.use(express.json());


app.use("/auth", authRoutes);
app.use("/gadgets", gadgetRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
