/**
 * author       : Anthony Osei-Agyemnag
 * date         : 30/01/2026
 * decription   : Task Server Application
 */


const {dotenv, config, express, winston } = require('./config/setupmodules')
const app = express();


// require('dotenv').config({ path : './config/config.env'});
// require('dotenv').config({ path : './config/default.json'});

dotenv.config({ path : './config/config.env'});
dotenv.config({ path : './config/default.json'});


require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/dbconnection')();
require('./startup/validation')();


const PORT = process.env.PORT || 5000;


if (process.env.NODE_ENV === 'production') {
  // Run production-specific logic
  console.log('Running in production mode');
} else {
  // Run development-specific logic (default if NODE_ENV is not set)
  console.log('Running in development mode');
  console.log(`Backend Server running on ${config.get("db.host")}... `);
}   

app.get('/', (req, res) => {
  res.send(`Server and Database up and running! ${PORT} <br/>  Populate database with these fields: <strong>title, description, status = "pending", dueDate</strong> `);
});

const appServer =  app.listen(PORT, () => winston.info(`Backend Server running on port ${PORT} \n Backend running on http://localhost:${PORT}...`));
app.listen(console.log(`Backend Server running on port ${PORT} \n Backend running on http://localhost:${PORT}`));

module.exports = appServer;
