const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { listFrameworks, hasFramework, getFramework } = require('@netlify/framework-info')

// Create Express Server
const app = express();

// Configuration
const PORT = 3333;
const HOST = "localhost";
const FRAMEWORK_PORT = 3000;
const API_SERVICE_URL = `http://${HOST}:${FRAMEWORK_PORT}`;

// Health check GET endpoint
app.get('/healthcheck', (req, res, next) => {
  res.send('This route will handle health checks');
});

// All other routes should be passed along to the client site
app.use('/', createProxyMiddleware('**', {
  target: API_SERVICE_URL,
  changeOrigin: true,
}));

// Start the Proxy
app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});