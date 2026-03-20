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
    winston.error(err.message, err.meta);
    
    res.status(500).send('Something failed.');
}