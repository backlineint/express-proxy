const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { listFrameworks } = require('@netlify/framework-info')

async function launchBridge() {
  const frameworkData = await listFrameworks();

  // Create Express Server
  const app = express();

  // Configuration
  const port = 3333;
  const host = "localhost";
  const frameworkPort = frameworkData[0].dev.port;
  const apiServiceUrl = `http://${host}:${frameworkPort}`;

  // Health check GET endpoint
  app.get('/healthcheck', (req, res, next) => {
    res.send('This route will handle health checks');
  });

  // All other routes should be passed along to the client site
  app.use('/', createProxyMiddleware('**', {
    target: apiServiceUrl,
    changeOrigin: true,
  }));

  // Start the Proxy
  app.listen(port, host, () => {
    console.log(`Starting Proxy at ${port}:${host}`);
  });

}

launchBridge();