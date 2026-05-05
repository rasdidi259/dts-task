/**
 * Author       : Applicant
 * date         : 30/03/2026
 * Description  : Modules Setup File
 */


// Modules
'use strict';

//const Joi = require('joi');

// const cookieParser = require('cookie-parser');
// const { config } = require('dotenv');
// const joi = require('joi');
// const multer = require('multer');
// const swaggerJSDoc = require('swagger-jsdoc');
// const { serve, serveFiles } = require('swagger-ui-express');

module.exports = {
    ensureAuth: function(req, res, next) {
     if (req.isAuthenticated()) {
         return next()
     } else {
         res.redirect('/')
     }
    },

    ensureGuest:function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/')
        } else {
            return next()
        }
    },
    bcrypt              : require('bcryptjs'),
    bodyParser          : require('body-parser'),
   // config              : require('config'),
    connectFlash        : require('connect-flash'),
    connectMongo        : require('connect-mongo'),
    cookieParser        : require('cookie-parser'),
    cors                : require('cors'),
    dotenvx             : require('@dotenvx/dotenvx').config({path: `${process.env.NODE_ENV === 'production' ? './.env.production' : './.env.development'}`}), // Load environment
    crossSpawn          : require('cross-spawn'),
    debug               : require('debug')('app:server'),
    express             : require('express'),
    ExpressHandlebars   : require('express-handlebars'),
    ExpressSession      : require('express-session'),
    fawn                : require('fawn'),
    GoogleStrategy      : require('passport-google-oauth20').Strategy,
    //joi                 : require('joi'),
    //passwordComplexity  : require('joi-password-complexity'),
    jsonwebtoken        : require('jsonwebtoken'),
    lodash              : require('lodash'),
    passport            : require('passport'),
    path                : require('path'),       
    methodOverride      : require('method-override'),
    morgan              : require('morgan'),    
    moment              : require('moment'),
    monk                : require('monk'),
    multer              : require('multer'), 
    mongoose            : require('mongoose'),
    nodemailer          : require('nodemailer'),
    nodemon             : require('nodemon'),
    passport            : require('passport'),
    pug                 : require('pug'),
    session             : require('express-session'),
    swaggerJsdoc        : require('swagger-jsdoc'),
    swaggerUi           : require('swagger-ui-express'),
    serve               : require('swagger-ui-express').serve,
    winston             : require('winston'),
    winstonMongodb      : require('winston-mongodb')
}
