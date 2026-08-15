import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Model } from 'objection';
import knex from './db/knex.js';
import expenseRouter from './routes/expenses.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

Model.knex(knex);

app.use(helmet());
app.use(cors());
app.use(express.json());

// API health route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TaskBridge API placeholder server' });
});

// Mount expense routes
app.use('/', expenseRouter);

// Serve static frontend if public/ exists
const publicDir = path.join(__dirname, '../public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  // For SPA client-side routing support, serve index.html for non-API routes
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/expenses') || req.path.startsWith('/balances')) return res.status(404).json({ error: 'Not Found' });
    return res.sendFile(path.join(publicDir, 'index.html'));
  });
} else {
  // No frontend build found: root shows a JSON health check
  app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'TaskBridge API placeholder server' });
  });
}

// Fallback 404 for anything not handled
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`TaskBridge API server running on port ${PORT}`);
  });
}

export default app;
