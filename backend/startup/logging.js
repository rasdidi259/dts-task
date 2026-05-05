/*
* author       : Applicant
* date         : 30/03/2026
* description  : Logging Settings 
 */

// dotenv,

const {  winston, winstonMongodb } = require('../config/setupmodules');

const dns = require('node:dns/promises');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };


module.exports = function(dbLogsUri, isDevEnv) {

    const logger = winston.createLogger({
        db: dbLogsUri,
        options: clientOptions,
        level: 'error',
        collection: 'logs',
        silent: (isDevEnv === 'development'),
        transports: [
            new winston.transports.Console({
                level: 'info',
                env: isDevEnv,
                format: winston.format.combine(
                    winston.format.colorize(options = { all: true }),
                )
            }),
            new winstonMongodb.MongoDB({
                db: dbLogsUri,
                options: clientOptions,
                level: 'error',
                collection: 'error-logs'
            }),
            new winstonMongodb.MongoDB({
                db: dbLogsUri,
                options: clientOptions,
                level: 'info',
                collection: 'info-logs'
            }),
            new winstonMongodb.MongoDB({
                db: dbLogsUri,
                options: clientOptions,
                level: 'warn',
                collection: 'warn-logs'
            })
        ],
        format: winston.format.combine(
            winston.format.timestamp('DD-MM-YYYY HH:mm:ss'),
            winston.format.json(),

            winston.format.errors({ stack: true }),
            winston.format.colorize({ all: true }),
            winston.format.printf(({ timestamp, level, message, stack }) => {
                return `${timestamp} [${level}]: ${stack || message}`;
            }),
            winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'stack'] }),
            winston.format((info) => {
                if (info instanceof Error) {
                    return Object.assign({}, info, {
                        message: info.message,
                        stack: info.stack,
                    });
                }
                return info;
            })() // Handle Error objects properly
        )
    });

    logger.on('error', (err) => {
        console.error('Error in Winston logger:', err);
    })


    // following entry should appear in log collection and will contain
    // metadata JSON-property containing url field
    logger.info(`Winston logger configured to log errors to ${dbLogsUri} and info to console.`);

    return logger;
}