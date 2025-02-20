import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import connectMongoDB from './db/connectMongoDB.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json()); // Middleware to parse incoming requests with JSON payloads
app.use(express.urlencoded({extended: true})); // Middleware to parse incoming requests with URL-encoded payloads

app.use("/api/auth",authRoutes);

app.listen(8000, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});