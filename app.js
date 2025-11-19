import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { connectMongo } from './config/mongo.js';
import authRoutes from './routes/auth.js';
import partnerRoutes from './routes/partner.js';
import inquiryRoutes from './routes/inquiry.js';
import adminRoutes from './routes/admin.js';
import { rateLimiter } from './middlewares/rateLimiter.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use(rateLimiter);

await connectMongo();

app.use('/api/auth', authRoutes);
app.use('/api/partner', partnerRoutes);
app.use('/api/inquiry', inquiryRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.json({ ok: true, service: 'pixisphere-backend' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
