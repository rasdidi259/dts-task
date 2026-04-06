/**
 * author       :Applicant
 * date         : 30/03/2026
 * decription   :A middleware for verifying token (For Authorization)
 *              - Checks for the presence of a token in the request header. 
 */

const jwt = require('jsonwebtoken');
//const config = require('config');
require('dotenv').config();


module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided');

    try {
        //const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        req.user = decoded;

        next();
    } catch (error) {
        res.status(400).send('Invalid Token.');
    }
}