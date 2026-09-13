import { createServer } from 'node:http';
import { MODES } from '@curve/contracts';
import { spots } from './spots.js';

const port = Number(process.env.PORT || 8787);
const headers = { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' };
const send = (response, status, body) => { response.writeHead(status, headers); response.end(JSON.stringify(body)); };

const server = createServer((request, response) => {
  if (request.method === 'OPTIONS') return send(response, 204, null);
  if (request.method !== 'GET') return send(response, 405, { error: 'method_not_allowed' });
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (url.pathname === '/health') return send(response, 200, { status: 'ok' });
  if (url.pathname === '/api/v1/spots') {
    const mode = url.searchParams.get('mode');
    if (mode && !MODES.includes(mode)) return send(response, 400, { error: 'invalid_mode' });
    return send(response, 200, { data: mode ? spots.filter(spot => spot.mode === mode) : spots });
  }
  const match = url.pathname.match(/^\/api\/v1\/spots\/([^/]+)$/);
  if (match) {
    const spot = spots.find(item => item.id === decodeURIComponent(match[1]));
    return spot ? send(response, 200, { data: spot }) : send(response, 404, { error: 'spot_not_found' });
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
