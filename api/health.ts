import { Request, Response } from 'express';

export interface HealthResponse {
  status: 'ok' | 'degraded';
  service: string;
  uptimeSeconds: number;
  timestamp: string;
  onemap: {
    configured: boolean;
    authMethod: 'token' | 'none';
  };
  features: {
    geolocation: boolean;
    transactions: boolean;
    soraRates: boolean;
    slaRouting: boolean;
    hdbDataset: boolean;
  };
}

export function handleHealthCheck(req: Request, res: Response) {
  const hasToken = !!process.env.ONEMAP_TOKEN;

  const healthData: HealthResponse = {
    status: 'ok',
    service: 'SG GeoProp SLA Serverless API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    onemap: {
      configured: hasToken,
      authMethod: hasToken ? 'token' : 'none',
    },
    features: {
      geolocation: true,
      transactions: true,
      soraRates: true,
      slaRouting: true,
      hdbDataset: true,
    },
  };

  res.setHeader('Content-Type', 'application/json');
  res.json(healthData);
}
