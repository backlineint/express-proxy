const http = require('http');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createServer();
const express = require('express');

const { spawn } = require('child_process');
const { listFrameworks } = require('@netlify/framework-info');

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

function addListeners(child) {
  child.stdout.on('data', (data) => {
    console.log(`stdout:\n${data}`);
  });
  
  child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
  
  child.on('error', (error) => {
    console.error(`error: ${error.message}`);
  });
  
  child.on('close', (code) => {
    // Assumption here is that PM2/nodemon/whatever will relaunch when this process fails.
    console.log(`child process exited with code ${code}`);
    process.exit(1);
  });
}

async function launchBridge() {
  console.log('=== Starting Decoupled Bridge... ===');

  // General configuration
  const host = 'localhost';
  // Use value of -p flag if it exists, otherwise fall back on 8000
  const bridgePort = argv.p ? argv.p : 8000;
  const pantheonPort = 3333;
  const pantheonUrl = `http://${host}:${pantheonPort}`;
  const pantheonPrefix = '/pantheon';

  // Framework configuration
  const frameworkData = await listFrameworks();
  const frameworkPort = frameworkData[0].dev.port;
  const frameworkUrl = `http://${host}:${frameworkPort}`;

  // Proxy all traffic to desired port
  http.createServer((req, res) => {
    let target = frameworkUrl;
    if (req.url.startsWith(pantheonPrefix)) {
      target = pantheonUrl;
    }
    else {
    }
    proxy.web(req, res, { target })
  }).listen(bridgePort);

  console.log(`Launching ${frameworkData[0].name}`);
  const framework = spawn('npm', ['run', 'dev']);
  addListeners(framework);

  // Create Express Server
  // Note: we could use node http here if we want to eliminate the Express dependency,
  // Express just helps streamline the POC work.
  const app = express();

  // Health check GET endpoint
  app.get('/pantheon/health', (req, res, next) => {
    res.send('OK');
  });

  // Start the Proxy
  app.listen(pantheonPort, host, () => {
    console.log(`Starting Pantheon Server at ${host}:${pantheonPort}`);
  });
}

launchBridge();