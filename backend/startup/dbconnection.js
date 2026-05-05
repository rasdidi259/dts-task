/**
 * author       : Applicant
 * date         : 30/03/2026
 * decription   : Database Connection
 */


//, winstonMongodb


// const { MongoDB } = require('winston/lib/winston/transports');

const { mongoose, winston } = require('../config/setupmodules')

const dns = require('node:dns/promises');
dns.setServers(['8.8.8.8', '1.1.1.1']); 
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };


// Create a MongoDB connection and check thet status
module.exports = async function(dbUri) {

    try {        
        await mongoose.connect(dbUri, clientOptions);
    } catch (err) {
        winston.error('Error connecting to MongoDB:', err.message);
    }

}