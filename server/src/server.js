import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './config/config.js';
import bodyParser from 'body-parser';
import authRoutes from './routers/auth.js';
import dashboardRoutes from './routers/dashboard.js';
import verifyToken from './utils/verify-token.js';
import crypto from 'crypto';

// Generate JWT Secret
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log(`Generated JWT Secret: ${jwtSecret}`);

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', authRoutes);
app.use('/api/dashboard', verifyToken, dashboardRoutes);

const connect = async (url) => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('Database Connected...');
    } catch (err) {
        console.error(err);
    }
};

export const start = async () => {
    await connect(config.DB_URL);
    app.listen(config.PORT, () => {
        console.log(`Server has started on port ${config.PORT}...`);
    });
};
