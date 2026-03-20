/**
 * author       : Applicant
 * date         : 30/01/2026
 * decription   : Database Connection
 */


const { dotenv, config, mongoose, winston } = require('../config/setupmodules')
dotenv.config();

//working one
//dotenv.config({ path : './config/config.env'});
//require('dotenv').config({ path : './config/default.json'});

const dns = require('node:dns/promises');
dns.setServers(['8.8.8.8', '1.1.1.1']); 
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };


// Create a MongoDB connection and check thet status
module.exports = function() {
    const db = config.get("db.host");
    //const db = process.env.MONGODB_URL;
    return  mongoose
        .connect(db, clientOptions)
        .then(() => winston
                        .transports.MongoDB(db, clientOptions)
                        .info(`Connected to ${process.env.MONGODB_URL}...`))
        .catch((error) => winston.error(`Could not connect to ${db}...`, error));
}