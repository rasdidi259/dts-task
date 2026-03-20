/**
 * author       : Applicant
 * date         : 30/01/2026
 * decription   : Route Configuration
 */


const { bodyParser, cors, express } = require('../config/setupmodules')
const tasks = require('../routes/tasks');
const error = require('../middleware/error');

module.exports = function(app) {

    // Setting up and using middleware for json()
    // i.e. parsing the incoming request body as JSON
    app.use(express.json());
   
    // for traditional HTML form data (x-www-form-urlencoded)
    app.use(express.urlencoded({ extended:false}));

    app.use(cors());
    
    // Setup the Routers 
    app.use('/api/tasks', tasks);

    // Error Handling function(passing error handling function)
    app.use(error);
}