// server.js

// ============================BASE SETUP======================================

const express = require('express');           // call express
const routes = require('./routes.js');
const dragnetSearch = require('./dragnetSearch.js');
const indexInfo = require('./indexConfiguration.js');
const bodyParser = require('body-parser');

const app = express();                        // define our app using express

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;    // set our port

// ======================INITIALIZE ELASTICSEARCH DB===========================
const initializeIndex = dragnetSearch.initIndex;
const initializeMapping = dragnetSearch.initMapping;
const indexConfiguration = indexInfo.configuration;
const indexMapping = indexInfo.mapping;

initializeIndex(indexConfiguration)
.then(() => initializeMapping(indexMapping))
.catch((err) => {
  console.log(err);
});

// -------------------------REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
const router = routes.router;
app.use('/', router);

// =============================START THE SERVER===============================
app.listen(port);
console.log('Magic happens on port ', port);






// TODO:
// "All servers using express.bodyParser are vulnerable to an attack which creates
// an unlimited number of temp files on the server, potentially filling up all
// the disk space, which is likely to cause the server to hang."
// Source: http://andrewkelley.me/post/do-not-use-bodyparser-with-express-js.html
// Solution1: Write cron job to remove stale temp files on server periodically
// Solution2: Use express.json() over bodyParser.json() and express.urlencoded()
