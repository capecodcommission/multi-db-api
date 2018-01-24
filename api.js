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

//******************************---wMVP3_CapeCodMA DATABASE CALLS---******************************

//GET ScenarioWiz data from 'wMVP3_CapeCodMA' DB where scenario id = ##
//EXAMPLE: SCENARIO ID 2727 | http://sql-connect.api.capecodcommission.org/api/ScenarioWiz/2727
app.get('/api/ScenarioWiz/:id', function(req , res) {

  var query = 'select * from CapeCodMA.Scenario_Wiz where ScenarioID = ' + req.params.id;

  executeQuery (res, query, wmvp3_DBConfig);
});

//GET TreatmentWiz data from 'wMVP3_CapeCodMA' DB where scenario id = ##
//EXAMPLE: SCENARIO ID 2727 | http://sql-connect.api.capecodcommission.org/api/TreatmentWiz/2727
app.get('/api/TreatmentWiz/:id', function(req , res) {

  var query = 'select * from CapeCodMA.Treatment_Wiz where ScenarioID = ' + req.params.id;

  executeQuery (res, query, wmvp3_DBConfig);
});

//GET Embayments table from 'wMVP3_CapeCodMA' DB
//EXAMPLE: http://sql-connect.api.capecodcommission.org/api/Embayments
app.get('/api/Embayments', function(req , res) {

  var query = 'select * from CapeCodMA.Embayments';

  executeQuery (res, query, wmvp3_DBConfig);
});

//GET FTCoeff table from 'wMVP3_CapeCodMA' DB
//EXAMPLE: http://sql-connect.api.capecodcommission.org/api/FTCoeff
app.get('/api/FTCoeff', function(req , res) {

  var query = 'select * from CapeCodMA.FTCoeff';

  executeQuery (res, query, wmvp3_DBConfig);
});

//GET MATowns from 'wMVP3_CapeCodMA' DB
//EXAMPLE: http://sql-connect.api.capecodcommission.org/api/MATowns
app.get('/api/MATowns', function(req , res) {

  var query = 'select * from CapeCodMA.MATowns';

  executeQuery (res, query, wmvp3_DBConfig);
});

//GET SubEmbayments from 'wMVP3_CapeCodMA' DB
//EXAMPLE: http://sql-connect.api.capecodcommission.org/api/SubEmbayments
app.get('/api/SubEmbayments', function(req , res) {

  var query = 'select * from CapeCodMA.SubEmbayments';

  executeQuery (res, query, wmvp3_DBConfig);
});

//GET Subwatersheds from 'wMVP3_CapeCodMA' DB
//EXAMPLE: http://sql-connect.api.capecodcommission.org/api/Subwatersheds
app.get('/api/Subwatersheds', function(req , res) {

  var query = 'select * from CapeCodMA.Subwatersheds';

  executeQuery (res, query, wmvp3_DBConfig);
});

//GET parcelMaster data from 'wMVP3_CapeCodMA' DB where scenario id = ##
//EXAMPLE: SCENARIO ID 2488 | http://sql-connect.api.capecodcommission.org/api/parcelMaster/2488
app.get('/api/parcelMaster/:id', function(req , res) {

  var query = 'select * from CapeCodMA.parcelMaster WHERE scenario_id = ' + req.params.id;

  executeQuery (res, query, wmvp3_DBConfig);
});

//GET wiz_treatment_towns data from 'wMVP3_CapeCodMA' DB where scenario id = ##
//EXAMPLE: SCENARIO ID 2488 | http://sql-connect.api.capecodcommission.org/api/wiz_treatment_towns/2488
app.get('/api/wiz_treatment_towns/:id', function(req , res) {

  var query = 'select * from dbo.wiz_treatment_towns WHERE wtt_scenario_id = ' + req.params.id;

  executeQuery (res, query, wmvp3_DBConfig);
});


//GET WastewaterSource3 data from 'wMVP3_CapeCodMA' DB where municipal id = ##
//EXAMPLE: SCENARIO ID 224 | http://sql-connect.api.capecodcommission.org/api/WastewaterSource3/224
app.get('/api/WastewaterSource3/:id', function(req , res) {

  var query = 'select * from dbo.WastewaterSource3 WHERE Muni_ID = ' + req.params.id;

  executeQuery (res, query, wmvp3_DBConfig);
});

//GET ParcelCharacteristics data from 'wMVP3_CapeCodMA' DB where municipal id = ##
//EXAMPLE: SCENARIO ID 224 | http://sql-connect.api.capecodcommission.org/api/ParcelCharacteristics/224
app.get('/api/ParcelCharacteristics/:id', function(req , res) {

  var query = 'select * from dbo.ParcelCharacteristics WHERE Muni_ID = ' + req.params.id;

  executeQuery (res, query, wmvp3_DBConfig);
});

//******************************---WaterQualityMonitoring DATABASE CALLS---******************************

//*****TODO: REMOVE THIS CALL ONCE NEW WQ APP IS FULLY FUNCTIONAL & REPLACED BY 'getStateion' CALL BELOW THIS*****
//GET WaterQualityReading data from from 'WaterQualityMonitoring' DB where U id (Water Quality Monitoring Station ID) = XXX###
//EXAMPLE: Water Quality Monitoring Station ID 'HB2' | http://sql-connect.api.capecodcommission.org/api/getEmbayment/HB2
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


//GET WaterQualityReading data from from 'WaterQualityMonitoring' DB where U id (Water Quality Monitoring Station ID) = XXX###
//EXAMPLE: Water Quality Monitoring Station ID 'HB2' | http://sql-connect.api.capecodcommission.org/api/getStation/HB2
app.get("/api/getStation/:name", function(req , res) {

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

//GET Station names from WaterQualityReading where Name (Embayment Name) = NAME
//EXAMPLE: Embayment 'Three Bays' | http://sql-connect.api.capecodcommission.org/api/getStations/Three%20Bays
app.get("/api/getStations/:name", function(req , res) {

  var query = "select DISTINCT \
                r.Uid \
                from dbo.Embayment e \
                left join dbo.Station s \
                  on e.Id = s.EmbaymentId\
                left join dbo.WaterQualityReading r \
                  on s.Name = r.Uid \
                where e.Name = " + "'" + req.params.name + "'"

  executeQuery (res, query, wqm_DBConfig);
});

//GET Embayment data from 'WaterQualityMonitoring' where embayment id is not null & embayment is in Barnstable County (Cape Cod)
//EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getEmbayments/
app.get('/api/getEmbayments', function(req , res) {

  var query = 'select id as EMBAYMENT_ID, Name as EMBAYMENT from dbo.Embayment where id is not null and id < 160'

  executeQuery (res, query, wqm_DBConfig);
});

//******************************---CommunityCharacteristics DATABASE CALLS---******************************

//GET Neighborhood Name data from 'commchar_0815' table in 'CommunityCharacteristics' DB
//EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getNeighborhoods
app.get('/api/getNeighborhoods', function(req , res) {

  var query = "select distinct Neighborhood from dbo.commchar_0815 where Neighborhood != ''"

  executeQuery (res, query, comchar_DBConfig);
});

//GET Activity Center Name data from 'commchar_0815' table in 'CommunityCharacteristics' DB
//EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getActivityCenters
app.get('/api/getActivityCenters', function(req , res) {

  var query = "select distinct AC_FINAL as center from dbo.commchar_0815 where AC_FINAL != ''"

  executeQuery (res, query, comchar_DBConfig);
});

//GET Town Name data from 'commchar_0815' table in 'CommunityCharacteristics' DB
//EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getTowns
app.get('/api/getTowns', function(req , res) {

  var query = "select distinct Town as town from dbo.commchar_0815 where Town != ''"

  executeQuery (res, query, comchar_DBConfig);
});

//GET Selected Geography Score data from 'commchar_0815' table in 'CommunityCharacteristics' DB
//EXAMPLE: Neighborhood score data | http://sql-connect.api.capecodcommission.org/api/getACScores/nbh
app.get('/api/getACScores/:type', function(req , res) {

  var type =  req.params.type

  var query = ""

  if (type === 'ac') {

    query = "SELECT \
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
  } else if (type === 'nbh') {

    query = "SELECT \
                Neighborhood as Activity_Center \
                ,SUM(SUM_CAsites) as Community \
                ,SUM(SUM_BAsites) as Business \
                ,SUM(PctImp_Above40) as Impervious \
                ,SUM(CASE \
                  WHEN FormWeight >= 6 AND \
                    PctImp_Above40 = 1 THEN 1 \
                  ELSE 0 \
                END) as GoodForm \
              FROM dbo.commchar_0815 \
              WHERE Neighborhood != '' \
              GROUP BY Neighborhood"
  } else if (type === 'twn') {

    query = "SELECT \
                Town as Activity_Center \
                ,SUM(SUM_CAsites) as Community \
                ,SUM(SUM_BAsites) as Business \
                ,SUM(PctImp_Above40) as Impervious \
                ,SUM(CASE \
                  WHEN FormWeight >= 6 AND \
                    PctImp_Above40 = 1 THEN 1 \
                  ELSE 0 \
                END) as GoodForm \
              FROM dbo.commchar_0815 \
              WHERE Town != '' \
              GROUP BY Town"
  }

  executeQuery (res, query, comchar_DBConfig);
});

//GET d3 Chart data from by Selected Geograhy Name and Type from 'commchar_0815' table in 'CommunityCharacteristics' DB
//EXAMPLE: Neighborhood: Ridgewood score data | http://sql-connect.api.capecodcommission.org/api/getd3Data/nbh/Ridgewood
app.get('/api/getd3Data/:type/:name', function(req , res) {

  var type =  req.params.type
  var name = req.params.name

  var query = ""

  if (type === 'ac') {

    query = "SELECT \
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
              WHERE AC_FINAL = " + "'" + name + "'" + " GROUP BY AC_FINAL"
  } else if (type === 'nbh') {

    query = "SELECT \
                Neighborhood as Activity_Center \
                ,SUM(SUM_CAsites) as Community \
                ,SUM(SUM_BAsites) as Business \
                ,SUM(PctImp_Above40) as Impervious \
                ,SUM(CASE \
                  WHEN FormWeight >= 6 AND \
                    PctImp_Above40 = 1 THEN 1 \
                  ELSE 0 \
                END) as GoodForm \
              FROM dbo.commchar_0815 \
              WHERE Neighborhood = " + "'" + name + "'" + " GROUP BY Neighborhood"
  } else if (type === 'twn') {

    query = "SELECT \
                Town as Activity_Center \
                ,SUM(SUM_CAsites) as Community \
                ,SUM(SUM_BAsites) as Business \
                ,SUM(PctImp_Above40) as Impervious \
                ,SUM(CASE \
                  WHEN FormWeight >= 6 AND \
                    PctImp_Above40 = 1 THEN 1 \
                  ELSE 0 \
                END) as GoodForm \
              FROM dbo.commchar_0815 \
              WHERE Town = " + "'" + name + "'" + " GROUP BY Town"
  }

  executeQuery (res, query, comchar_DBConfig);
});

//******************************---Tech_Matrix DATABASE CALLS---******************************

// GET Technology_Matrix data from 'Tech_Matrix' DB where 'TM_ID' = ##
// EXAMPLE: Aquaculture - Shellfish Cultivated In Estuary Bed | http://sql-connect.api.capecodcommission.org/api/Technology_Matrix/11
app.get('/api/Technology_Matrix/:id', function(req , res) {

  var query = 'select * from dbo.Technology_Matrix WHERE TM_ID = ' + req.params.id;

  executeQuery (res, query, tm_DBConfig);
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
