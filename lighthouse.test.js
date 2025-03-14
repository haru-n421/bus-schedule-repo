import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { expect, describe, test, beforeAll, afterAll } from '@jest/globals';
import http from 'http';
import fs from 'fs';
import fetch from 'node-fetch';
import { TextDecoder } from 'util';

// Node.js環境でTextDecoderを利用可能にする
global.TextDecoder = TextDecoder;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Basic Server Tests', () => {
  let server;

  beforeAll(async () => {
    // 静的ファイルを提供するシンプルなサーバーを作成
    server = http.createServer((req, res) => {
      let filePath;
      if (req.url === '/' || req.url === '/index.html') {
        filePath = join(__dirname, 'index.html');
      } else if (req.url.startsWith('/js/')) {
        filePath = join(__dirname, req.url);
      }

      if (filePath && fs.existsSync(filePath)) {
        const contentType = filePath.endsWith('.js') ? 'application/javascript' : 'text/html';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(fs.readFileSync(filePath));
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    });

    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.listen(8080, resolve);
    });
  });

  afterAll(async () => {
    if (server) {
      await new Promise(resolve => server.close(resolve));
    }
  });

  test('server responds with index.html', async () => {
    const response = await fetch('http://localhost:8080');
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toContain('<!DOCTYPE html>');
  });

  test('server responds with main.js', async () => {
    const response = await fetch('http://localhost:8080/js/main.js');
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toContain('function updateDisplay');
  });

  test('server returns 404 for non-existent files', async () => {
    const response = await fetch('http://localhost:8080/not-found');
    expect(response.status).toBe(404);
  });
});
