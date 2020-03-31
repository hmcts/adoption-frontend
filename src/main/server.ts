#!/usr/bin/env node
import * as config from 'config';
import * as propertiesVolume from '@hmcts/properties-volume';
propertiesVolume.addTo(config);

import * as secrets from 'modules/secrets';
secrets.setup(config);
const { Logger } = require('@hmcts/nodejs-logging');
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import { app } from './app';

const logger = Logger.getLogger('server');

// TODO: set the right port for your application
const port: number = parseInt(process.env.PORT, 10) || 3000;

if (app.locals.ENV === 'development') {
  const sslDirectory = path.join(__dirname, 'resources', 'localhost-ssl');
  const sslOptions = {
    cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt')),
    key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
  };
  const server = https.createServer(sslOptions, app);
  server.listen(port, () => {
    logger.info(`Application started: https://localhost:${port}`);
  });
} else {
  app.listen(port, () => {
    logger.info(`Application started: http://localhost:${port}`);
  });
}
