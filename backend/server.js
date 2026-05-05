/**
 * author       : Applicant
 * date         : 30/03/2026
 * decription   : Task Server Application
 */

// dotenv,config,dotenvx, winston

const { express } = require('./config/setupmodules')
const app = express();

const dbUri = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI_PROD : process.env.MONGODB_URI_DEV;
const isDevEnv = process.env.NODE_ENV;
const dbLogsUri = process.env.MONGODB_URI_LOGS;
const PORT = process.env.PORT || 6000;
const myEnv = process.env.NODE_ENV || 'development';   


require('./startup/dbconnection')(dbUri);
require('./startup/logging')(dbLogsUri, isDevEnv);
require('./startup/validation')();
require('./startup/routes')(app);
require('./startup/swagger')(app);
  

app.get('/', (req, res) => {
  res.send(`Server and Database up and running! ${PORT} <br/>  Populate database with these fields: <strong>title, description, status = "pending", dueDate</strong> `);
});

const server = app.listen(PORT, ()=>{
  console.log(`Backend Server is running on port ${PORT}...${myEnv}`);
  console.log(`Current Environment: ${myEnv} - ${process.env.APP_NAME}`);
});

module.exports = server;
