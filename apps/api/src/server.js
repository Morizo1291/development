import { createServer } from 'node:http';
import { MODES } from '@curve/contracts';
import { spots } from './spots.js';

const port = Number(process.env.PORT || 8787);
const headers = { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' };
const send = (response, status, body) => { response.writeHead(status, headers); response.end(JSON.stringify(body)); };

const server = createServer((request, response) => {
  // Basic CORS preflight support
  if (request.method === 'OPTIONS') return send(response, 204, null);
  const url = new URL(request.url, `http://${request.headers.host}`);

  // Health check
  if (request.method === 'GET' && url.pathname === '/health') return send(response, 200, { status: 'ok' });

  // GET /api/v1/spots and GET /api/v1/spots/:id
  if (request.method === 'GET' && url.pathname === '/api/v1/spots') {
    const mode = url.searchParams.get('mode');
    if (mode && !MODES.includes(mode)) return send(response, 400, { error: 'invalid_mode' });
    return send(response, 200, { data: mode ? spots.filter(spot => spot.mode === mode) : spots });
  }
  if (request.method === 'GET') {
    const match = url.pathname.match(/^\/api\/v1\/spots\/([^/]+)$/);
    if (match) {
      const spot = spots.find(item => item.id === decodeURIComponent(match[1]));
      return spot ? send(response, 200, { data: spot }) : send(response, 404, { error: 'spot_not_found' });
    }
  }

  // POST /api/v1/navigation - start navigation to a spot
  if (request.method === 'POST' && url.pathname === '/api/v1/navigation') {
    let body = '';
    request.on('data', chunk => { body += chunk; });
    request.on('end', () => {
      try {
        const payload = body ? JSON.parse(body) : {};
        const spotId = payload.spotId;
        if (!spotId) return send(response, 400, { error: 'missing_spotId' });
        const spot = spots.find(s => s.id === spotId);
        if (!spot) return send(response, 404, { error: 'spot_not_found' });
        // For now simulate navigation creation and return a lightweight route object
        const route = {
          id: `route-to-${spot.id}`,
          spotId: spot.id,
          destination: spot.name,
          etaMinutes: spot.durationMinutes || Math.round((spot.distanceKm || 0) * 2),
          note: '案内を開始しました。実際のナビ連携はクライアント側で行ってください。'
        };
        return send(response, 200, { status: 'navigating', data: route });
      } catch (err) {
        return send(response, 400, { error: 'invalid_json' });
      }
    });
    return;
  }

  return send(response, 404, { error: 'not_found' });
});

server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.error(`CURVE API could not start: port ${port} is already in use. Stop the existing API or run PORT=<another-port> npm run dev:api.`);
    process.exitCode = 1;
    return;
  }
  throw error;
});

server.listen(port, () => {
  console.log(`CURVE API listening on http://localhost:${port}`);
});
