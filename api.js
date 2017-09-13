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
var server = app.listen(process.env.PORT || 8081, function () {

  var port = server.address().port;

  console.log('App now running on port', port);
});

// wMVP3_CapeCodMA' DB config object
var wmvp3_DBConfig = {
  user: 'DBAccess',
  password: 'Acce$$DB',
  // server: '192.138.212.28', //ACESS FROM EXTERNAL TO NETWORK? WHAT TRIVEDI WAS USING?
  server: '10.10.1.174',
  port: '65335',
  database: 'wMVP3_CapeCodMA',
  stream: true,
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 300000
  }
};

var wqm_DBConfig = {
  user: 'DBAccess',
  password: 'Acce$$DB',
  // server: '192.138.212.28', //ACESS FROM EXTERNAL TO NETWORK? WHAT TRIVEDI WAS USING?
  server: '10.10.1.174',
  port: '65335',
  database: 'WaterQualityMonitoring',
  stream: true,
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 300000
  }
};

var tm_DBConfig = {
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

var comchar_DBConfig = {
  user: 'DBAccess',
  password: 'Acce$$DB',
  // server: '192.138.212.28', //ACESS FROM EXTERNAL TO NETWORK? WHAT TRIVEDI WAS USING?
  server: '10.10.1.174',
  port: '65335',
  database: 'CommunityCharacteristics',
  stream: true,
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 300000
  }
};

// Estbalish a ScenarioWizQuery f(x) to connect to 'wMVP3_CapeCodMA' & get a response
var  executeQuery = function (res, query, config) {

  // Must close open sql connection first before opening a new one
  sql.close()

  // use mssql node package to connect to the 'wMVP3_CapeCodMA' db
  sql.connect(config, function (err) {

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

        // if there's an error in the query, console.log it out
        if (err) {

          console.log('Error while querying database :- ' + err);
          res.send(err);
        }

        // if there's no error, send the response
        else {

          res.send(recordset);
        }
      })
    }
  })
}

//GET ScenarioWiz table from wmvp3 DB
app.get('/api/ScenarioWiz/:id', function(req , res) {

  var query = 'select * from CapeCodMA.Scenario_Wiz where ScenarioID = ' + req.params.id;

  executeQuery (res, query, wmvp3_DBConfig);
});

//GET TreatmentWiz table from wmvp3 DB
app.get('/api/TreatmentWiz/:id', function(req , res) {

  var query = 'select * from CapeCodMA.Treatment_Wiz where ScenarioID = ' + req.params.id;

  executeQuery (res, query, wmvp3_DBConfig);
});

//GET Embayments table from wmvp3 DB
app.get('/api/Embayments', function(req , res) {

  var query = 'select * from CapeCodMA.Embayments';

  executeQuery (res, query, wmvp3_DBConfig);
});

//GET FTCoeff table from wmvp3 DB
app.get('/api/FTCoeff', function(req , res) {

  var query = 'select * from CapeCodMA.FTCoeff';

  executeQuery (res, query, wmvp3_DBConfig);
});

// GET MATowns from wmvp3
app.get('/api/MATowns', function(req , res) {

  var query = 'select * from CapeCodMA.MATowns';

  executeQuery (res, query, wmvp3_DBConfig);
});

// GET SubEmbayments from wmvp3
app.get('/api/SubEmbayments', function(req , res) {

  var query = 'select * from CapeCodMA.SubEmbayments';

  executeQuery (res, query, wmvp3_DBConfig);
});

// GET Subwatersheds from wmvp3
app.get('/api/Subwatersheds', function(req , res) {

  var query = 'select * from CapeCodMA.Subwatersheds';

  executeQuery (res, query, wmvp3_DBConfig);
});

// GET parcelMaster from wmvp3
// EXAMPLE: scenarioid: /api/parcelMaster/2586
app.get('/api/parcelMaster/:id', function(req , res) {

  var query = 'select * from CapeCodMA.parcelMaster WHERE scenario_id = ' + req.params.id;

  executeQuery (res, query, wmvp3_DBConfig);
});

// GET wiz_treatment_towns from wmvp3
// EXAMPLE: scenarioid: /api/wiz_treatment_towns/2586
app.get('/api/wiz_treatment_towns/:id', function(req , res) {

  var query = 'select * from dbo.wiz_treatment_towns WHERE wtt_scenario_id = ' + req.params.id;

  executeQuery (res, query, wmvp3_DBConfig);
});


// GET WastewaterSource3 from wmvp3
// EXAMPLE: scenarioid: /api/WastewaterSource3/242
app.get('/api/WastewaterSource3/:id', function(req , res) {

  var query = 'select * from dbo.WastewaterSource3 WHERE Muni_ID = ' + req.params.id;

  executeQuery (res, query, wmvp3_DBConfig);
});

// GET ParcelCharacteristics from wmvp3
// EXAMPLE: scenarioid: /api/ParcelCharacteristics/242
app.get('/api/ParcelCharacteristics/:id', function(req , res) {

  var query = 'select * from dbo.ParcelCharacteristics WHERE Muni_ID = ' + req.params.id;

  executeQuery (res, query, wmvp3_DBConfig);
});

// GET StgEmbaymentWaterQualityData from WaterQualityMonitoring
// EXAMPLE: Allen Harbor: /api/StgEmbaymentWaterQualityData/101
app.get("/api/getEmbayment/:name", function(req , res) {

  var query = "SELECT \
                Date as date, \
                case WHEN SalFin IS NOT NULL THEN SalFin when  CorrectedSalinityPpt IS NOT NULL THEN CorrectedSalinityPpt WHEN SalinityPpt IS NOT NULL THEN SalinityPpt else null end as salinity, \
                case when DoMgFin IS NOT NULL THEN DoMgFin when  CorrectedDoMgPL IS NOT NULL THEN CorrectedDoMgPL when DoMgPL is not null then DoMgPL else null end as disolvedoxygen, \
                case WHEN TnPpmFin IS NOT NULL THEN TnPpmFin when TnUm is NOT NULL then TnUm else null end as nitrogen, \
                WaterTempC as water_temp, \
                PrecFin as precipitation, \
                TotalDepthM as depth, \
                NoxUmFin as nitrate_nitrite, \
                Nh4UmFin as ammonium, \
                Po4Um as orthophosphate, \
                ChlaUgPL as chlorophyll, \
                PhaeoUgPL as phaeophytin \
               FROM dbo.WaterQualityReading \
               WHERE Uid = " + "'" + req.params.name + "'" + 'ORDER BY cast(DATE as date)';

  executeQuery (res, query, wqm_DBConfig);
});

// GET StgEmbaymentWaterQualityData from WaterQualityMonitoring
// EXAMPLE: Allen Harbor: /api/StgEmbaymentWaterQualityData/101
app.get('/api/getEmbayments', function(req , res) {

  var query = 'select id as EMBAYMENT_ID, Name as EMBAYMENT from dbo.Embayment where id is not null and id < 161' 

  executeQuery (res, query, wqm_DBConfig);
});

app.get('/api/getNeighborhoods', function(req , res) {

  var query = "select distinct Neighborhood from dbo.commchar_0815 where Neighborhood != ''"

  executeQuery (res, query, comchar_DBConfig);
});

app.get('/api/getActivityCenters', function(req , res) {

  var query = "select distinct AC_FINAL as center from dbo.commchar_0815 where AC_FINAL != ''"

  executeQuery (res, query, comchar_DBConfig);
});

app.get('/api/getTowns', function(req , res) {

  var query = "select distinct Town as town from dbo.commchar_0815 where Town != ''"

  executeQuery (res, query, comchar_DBConfig);
});

// GET Technology_Matrix from Tech_Matrix
// EXAMPLE: Aquaculture - Shellfish Cultivated In Estuary Bed: /api/Technology_Matrix/11
app.get('/api/Technology_Matrix/:id', function(req , res) {

  var query = 'select * from dbo.Technology_Matrix WHERE TM_ID = ' + req.params.id;

  executeQuery (res, query, tm_DBConfig);
});

app.get('/api/getACScores', function(req , res) {

  var query = "SELECT \
                AC_FINAL as Activity_Center \
                ,SUM(SUM_CAsites) as Community \
                ,SUM(SUM_BAsites) as Business \
                ,SUM(PctImp_Above40) as Impervious \
                ,SUM(CASE \
                  WHEN FormWeight >= 6 AND \
                    PctImp_Above40 = 1 THEN 1 \
                  ELSE 0 \
                END) as GoodForm \
              FROM dbo.commchar_0815 \
              WHERE AC_FINAL != '' \
              GROUP BY AC_FINAL"

  executeQuery (res, query, comchar_DBConfig);

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
