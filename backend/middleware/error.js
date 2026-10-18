/**
 * author       : Applicant
 * date         : 03/02/2026
 * description  : Error handling and Logging Middleware
 */

const { winston, winstonMongodb } = require('../config/setupmodules');

module.exports = function(err, req, res, next) {
    // create new meta object to store in database
    let logMeta={
        stack: err.stack,                // error stack
        otherInfo: otherInfoData         // any other info you want to store
    }
    //logging error
    winston.error(err.message, err.meta)
    .format(winston.format.json())
    .options({ meta: logMeta }); // Pass the meta object to the logger  
    //.winstonMongodb.MongoDB({ db: process.env.MONGODB_LOGGING_URI, collection: 'log', level: 'error' });

    res.status(500).send('Something failed.');
}