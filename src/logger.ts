import log4js from 'log4js';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
const configLogger = {
    appenders: {
      default: {
        type: 'stdout',
        layout: {
          type: 'pattern',
          pattern: '[%d{ISO8601}] %m',
      }},
      server: {
        type: 'file',
        filename: 'log/server.log',
        maxLogSize: 10485760,
        layout: {
          type: 'pattern',
          pattern: '[%d{ISO8601}] %m',
      }
    }},
    categories: {
      default: { appenders: ['default'], level: 'all'},
      production: { appenders: ['server'], level: 'all'},
    }

};

// if development then print in console, else in log
const logTyp = process.env.NODE_ENV === 'development' ? 'default' : 'production';
export const loggerFile = log4js.configure(configLogger).getLogger(logTyp);
