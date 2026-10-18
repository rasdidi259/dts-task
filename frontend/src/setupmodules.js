/**
 * Author       : Applicant
 * Date         : 30/01/2026
 * Description  : Modules Setup File
 */


// Modules
'use strict';
export default {

    React           : require('react'),
    useState        : require('react'),
    useEffect       : require('react'),
    axios           : require('axios'),
    moment          : require('moment'),
    Link            : require('react-router-dom'),
    useParams       : require('react-router-dom'),
    useNavigate     : require('react-router-dom'),
    ReactDOM        : require('react-dom/client'),
    reportWebVitals : require('./src/reportWebVitals'),
    baseAPI_URL     : require('http://localhost:2000/api/tasks'),
    Dashboard       : require('../src/components/Dashboard'),
    CreateTask      : require('../src/components/Create'),
    UpdateTask      : require('../src/components/Update'),
    ViewTask        : require('../src/components/Read')
}
