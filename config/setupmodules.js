/**
 * Author       : Applicant
 * Date         : 30/01/2026
 * Description  : Modules Setup File
 */


// Modules
'use strict';

const cookieParser = require('cookie-parser');
const { config } = require('dotenv');
const Joi = require('joi');
const multer = require('multer');

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
            req.redirect('/')
        } else {
            return next()
        }
    },
    bcrypt              : require('bcryptjs'),
    bodyParser          : require('body-parser'),
    config              : require('config'),
    connectFlash        : require('connect-flash'),
    connectMongo        : require('connect-mongo'),
    cookieParser        : require('cookie-parser'),
    cors                : require('cors'),
    //this.crossEnv    = process.env.NODE_ENV === 'production' ? 'production' : 'development',
    crossSpawn          : require('cross-spawn'),
    debug               : require('debug')('app:server'),
    dotenv              : require('dotenv'),    
    express             : require('express'),
    ExpressHandlebars   : require('express-handlebars'),
    ExpressSession      : require('express-session'),
    fawn                : require('fawn'),
    GoogleStrategy      : require('passport-google-oauth20').Strategy,
    Joi                 : require('joi'),
    passwordComplexity  : require('joi-password-complexity'),
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
    winston             : require('winston'),
    winstonMongodb      : require('winston-mongodb')

}
