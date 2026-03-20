/*
* author        :   Applicant
* date          :   03/02/2026
* description   : Logging Settings 
 */

//const config = require('config'); // Requiring Middleware


//require('dotenv').config({ path : './config/config.env'});


require('express-async-errors');
const {dotenv, winston, winstonMongodb} =  require('../config/setupmodules');
const { combine, timestamp, printf, errors } = winston.format;



dotenv.config({ path : './config/config.env'});
//require('dotenv').config({ path : './config/default.json'});

// const winston = require('winston');
//require('winston-mongodb');



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
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' })
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
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
   
    // following entry should appear in log collection and will contain
    // metadata JSON-property containing url field
    logger.info(`Connected to database., ${process.env.MONGODB_URL}`);

}