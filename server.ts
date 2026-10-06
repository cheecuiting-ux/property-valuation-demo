import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleHealthCheck } from './api/health.ts';
import { handleSora } from './api/sora.ts';
import {
  handleSearch,
  handleRevGeocode,
  handleRouting,
  handleTokenMint,
} from './api/onemap.ts';
import { handleTransactions } from './api/transactions.ts';
import { handleHdbResale, handleHdbMetadata } from './api/hdb.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // API Endpoints in root /api folder
  app.get('/api/health', handleHealthCheck);
  app.get('/api/sora', handleSora);
  app.post('/api/sora', handleSora);

  // SLA OneMap API Endpoints
  app.post('/api/onemap/token', handleTokenMint);
  app.get('/api/onemap/search', handleSearch);
  app.get('/api/onemap/revgeocode', handleRevGeocode);
  app.get('/api/onemap/route', handleRouting);

  // Property Transactions API & HDB Live Dataset
  app.get('/api/transactions', handleTransactions);
  app.get('/api/hdb', handleHdbResale);
  app.get('/api/hdb/metadata', handleHdbMetadata);

  // Vite Integration
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SG GeoProp server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
