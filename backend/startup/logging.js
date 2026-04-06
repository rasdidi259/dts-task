/*
* author       : Applicant
* date         : 30/03/2026
* description  : Logging Settings 
 */


require('express-async-errors');
const { level } = require('winston');
const {dotenv, winston, winstonMongodb} =  require('../config/setupmodules');
const { combine, timestamp, printf, errors } = winston.format;

dotenv.config();


dotenv.config({ path : './config/config.env'});
//require('dotenv').config({ path : './config/default.json'});

// const winston = require('winston');
//require('winston-mongodb');
//winstonMongodb.MongoDB = require('winston-mongodb').MongoDB;


const dns = require('node:dns/promises');
dns.setServers(['8.8.8.8', '1.1.1.1']); 
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };


module.exports = function() {

    const logger = winston.createLogger({
    level: 'info',
    format: combine(
        errors({ stack: true }), // Essential for stack traces
        timestamp(),
        // Custom format to display the stack trace if it exists
        printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} ${level}: ${stack || message}`;
        })
    ),
    transports: [
        new winston.transports.Console([{ colorize: true, prettyPrint: true, level: 'info', format: winston.format.simple(level) }]),
        new winston.transports.File({ filename: 'error.log', level: 'error', options: clientOptions, format: combine(
            timestamp(options = { format: 'DD-MM-YYYY HH:mm:ss' }),
            printf(({ level, message, timestamp }) => {
                return `${timestamp} ${level}: ${message}`;
            })
        ) }),
        new winston.transports.MongoDB({ db: process.env.MONGODB_LOGGING_URI, collection: 'task-logging', level: 'error', options: clientOptions })   
    ],
    // Optional: handles errors that crash the process
    exceptionHandlers: [
        new winston.transports.File({ filename: 'exceptions.log' })
    ]
    });

    // Usage
    try {
        // logging to console so far
        logger.info('Connecting to database...');
 
    } catch (err) {
        logger.error(err); // Pass the error object directly
    }


    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.format.simple({level: 'error'}),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' }));

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    // Setup for logging Errors to a logfile
    winston.add(new winston.transports.File({ filename: 'logfile.log', level: 'info', options: clientOptions }))
        .format = combine(
            timestamp( options = { format: 'DD-MM-YYYY HH:mm:ss' }),
            printf(({ level, message, timestamp }) => {
                return `${timestamp} ${level}: ${message}`;
            })
        );
   
    // following entry should appear in log collection and will contain
    // metadata JSON-property containing url field
    logger.info(`Connected to database.hhhhh, ${process.env.MONGODB_URL}`);

}