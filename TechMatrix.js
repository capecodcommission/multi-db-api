//initialize node modules
var express = require("express");
    bodyParser = require("body-parser");
    sql = require("mssql");
    app = express();

// tell the app to use the body parser middleware
app.use(bodyParser.json());

// tell the app to use the CORS Middleware
app.use(function (req, res, next) {
  // Enable the CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
  next();
});

// set the server & port config as vars
var server = app.listen(process.env.PORT || 8086, function () {
  var port = server.address().port;
  console.log('App now running on port', port);
});

// set the configuration necessary to connect to the 'Technology_Matrix' database
var Technology_MatrixConfig = {
  user: 'DBAccess',
  password: 'Acce$$DB',
  // server: '192.138.212.28', //ACESS FROM EXTERNAL TO NETWORK? WHAT TRIVEDI WAS USING?
  server: '10.10.1.174',
  port: '65335',
  database: 'Tech_Matrix',
  stream: true,
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 300000
  }
};

// Estbalish a TechMatrixQuery f(x) to connect to 'Technology_Matrix' & get a response
var  TechMatrixQuery = function (res, query) {

  // use mssql node package to connect to the 'Technology_Matrix' db
  sql.connect(Technology_MatrixConfig, function (err) {

    // if there's an error connecting to the db, console.log it out
    if (err) {
      console.log("Error while connecting database :- " + err);
      res.send(err);
    }

    // if there's no error, create the Request object & query the db
    else {

      // indicate connection to the 'wMVP3_CapeCodMA' database
      console.log('we are connected');
      // create Request object
      var request = new sql.Request();

      // query the database
      request.query(query, function (err, recordset) {

        // **TODO** : create the stream for the request
        // request.pipe(stream)
        // request.stream = true;
        //
        // request.on('recordset', columns => {
        // })
        //
        // request.on('row', row => {
        // })
        //
        // request.on('error', err => {
        // })
        //
        // request.on('done', result => {
        // })

        // if there's an error in the query, console.log it out
        if (err) {
          console.log('Error while querying database :- ' + err);
          res.send(err);
        }

        // if there's no error, send the response
        else {
          // pipe.on('error', err => {
            // SOMETHING
          // })

          // pipe.on('finish', () => {
            // SOMETHING SOMETHING
          // })
          res.send(recordset);
        }

        // request.on('done', result => {
        //   console.log(result.rowsAffected)
        // })

      });
    }
  });
};

//GET API
app.get('/api/TechMatrix', function(req , res) {
  var query = 'select * from dbo.Technology_Matrix';
  TechMatrixQuery (res, query);
});

//POST API
//  app.post("/api/user ", function(req , res){
//                 var query = "INSERT INTO [user] (Name,Email,Password) VALUES (req.body.Name,req.body.Email,req.body.Password”);
//                 executeQuery (res, query);
// });
//
// //PUT API
//  app.put("/api/user/:id", function(req , res){
//                 var query = "UPDATE [user] SET Name= " + req.body.Name  +  " , Email=  " + req.body.Email + "  WHERE Id= " + req.params.id;
//                 executeQuery (res, query);
// });
//
// // DELETE API
//  app.delete("/api/user /:id", function(req , res){
//                 var query = "DELETE FROM [user] WHERE Id=" + req.params.id;
//                 executeQuery (res, query);
// });
