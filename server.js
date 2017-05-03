var express = require('express');
var app = express();

app.get('/', function (req, res) {

  var sql = require("mssql");

// var config = {
//   user: 'sa',
//   password: 'mypassword',
//   server: 'localhost',
//   database: 'SchoolDB'
// };
// config for the 'wMVP3_CapeCodMA' database
var config = {
  // domain: 'CCCOM',
  user: 'DBAccess',
  password: 'Acce$$DB',
  // server: '192.138.212.28', //ACESS FROM EXTERNAL TO NETWORK? WHAT TRIVEDI WAS USING?
  server: '10.10.1.174',
  port: '65335',
  database: 'wMVP3_CapeCodMA',
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// var config = {
//   domain: 'BC'
//   user: 'DBAccess',
//   password: 'Acce$$DB',
//   // server: '192.138.212.28', //ACESS FROM EXTERNAL TO NETWORK? WHAT TRIVEDI WAS USING?
//   server: 'localhost',
//   port: '8118',
//   database: 'wMVP3_CapeCodMA'
//   pool: {
//     max: 100,
//     min: 0,
//     idleTimeoutMillis: 30000
//   }
// };

  // connect to your database
  sql.connect(config, function (err) {

    if (err) console.log(err);

    // create Request object
    // var request = new sql.Request();
    var wMVP3_CapeCodMARequest = new sql.Request();

    // query to the database and get the records
    wMVP3_CapeCodMARequest.query('select top 25 * from WastewaterSource3', function (err, recordset) {

      if (err) console.log(err)

      // send records as a response
      res.send(recordset);

    });
  });
});

var server = app.listen(5000, function () {
  console.log('Server up...');
})
