
/**
 * author       : Applicant
 * date         : 03/02/2026
 * description  : Validation Settings 
 */

const Joi = require('joi');

module.exports = function() {
    Joi.objectId  = require('joi-objectid')(Joi); // returns a function 
}