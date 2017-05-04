//Initialize node modules
var express = require('express');
    sql = require("mssql");
    app = express();

// Define the HTTP 'GET' method - access through server port + /Scenario_Wiz
app.get('/api/ScenarioWiz', function (req, res) {

  // var sql = require("mssql");

  // set the configuration necessary to connect to the 'wMVP3_CapeCodMA' database
  var config = {
  user: 'DBAccess',
  password: 'Acce$$DB',
  // server: '192.138.212.28', //ACESS FROM EXTERNAL TO NETWORK? WHAT TRIVEDI WAS USING?
  server: '10.10.1.174',
  port: '65335',
  database: 'wMVP3_CapeCodMA',
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 15000
  }
};

// use mssql node package to connect to the 'wMVP3_CapeCodMA' db
sql.connect(config, function (err) {
  // if there's an error, write it to the console for feedback
  if (err) console.log(err);

  // create the mssql request object to use to inject into the db connection
  var wMVP3_CapeCodMARequest = new sql.Request();

    // query to the db and return records
    wMVP3_CapeCodMARequest.query('select top 1250 * from CapeCodMA.Scenario_Wiz', function (err, recordset) {

      // if there's an error, write it to the console for feedback
      if (err) console.log(err)

      // send the records to the 'GET' as a response (recordset)
      res.send(recordset);
    });
  });
});

// set up the server as port 8888
var server = app.listen(8888, function () {
  console.log('Server up...');
})
