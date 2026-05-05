
/**
 * author       : Applicant
 * date         : 30/03/2026
 * description  : Validation Settings 
 */

const Joi = require('joi');

// const {joi} =require('../config/setupmodules')

module.exports = function () {
    Joi.objectId = require('joi-objectid')(Joi); // returns a function 
}