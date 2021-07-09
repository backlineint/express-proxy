// TODO - remove unnecessary dependencies
// TODO - is there anything we can do to protect from port locking?
// TODO - this probably needs to run as an external dependency so we can easily
// install dependencies.

const http = require('http');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createServer();
const express = require('express');

const { spawn } = require('child_process');
const { listFrameworks } = require('@netlify/framework-info');

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
    console.log(`child process exited with code ${code}`);
    // TODO - Most likely should also exit this parent process if the framework exited.
    // assumption here is that PM2/nodemon/whatever will relaunch if this process fails.
  });
}

async function launchBridge() {
  console.log('=== Starting Decoupled Bridge... ===');

  // General configuration
  // TODO - Can we detect this from framework data?
  const host = 'localhost';
  // TODO - Make this an input param
  const bridgePort = 8000;
  const pantheonPort = 3333;
  const pantheonUrl = `http://${host}:${pantheonPort}`;
  const pantheonPrefix = '/pantheon';

  // Framework configuration
  const frameworkData = await listFrameworks();
  const frameworkPort = frameworkData[0].dev.port;
  const frameworkUrl = `http://${host}:${frameworkPort}`;

  // TODO - Could this be done more efficiently - just once for each case?
  http.createServer((req, res) => {
    let target = frameworkUrl;
    if (req.url.startsWith(pantheonPrefix)) {
      target = pantheonUrl;
      console.log(`=== Proxy pantheon path ===`);
    }
    else {
      console.log(`=== Proxy framework path ===`);
    }
    proxy.web(req, res, { target })
  }).listen(bridgePort);

  console.log(`Launching ${frameworkData[0].name}`);
  const framework = spawn('npm', ['run', 'dev']);
  addListeners(framework);

  // // TODO - Fork Pantheon Server process
  // const pantheonServer = fork('pantheon-server.js', [`-h=${host}`, `-p=3333`]);

  // Create Express Server
  // Note: we could use node http here if we want to eliminate the express dependency,
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