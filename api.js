//initialize node modules
var express = require("express");
    bodyParser = require("body-parser");
    sql = require("mssql");
    request = require("request");
    app = express();
    apicache = require('apicache')
    cache = apicache.middleware


// tell the app to use the body parser middleware
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

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
  user: 'ACExecute',
  password: 'ACEi$theplACE',
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
                a.* \
                FROM (SELECT \
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
               WHERE Uid = " + "'" + req.params.name + "'" + ') a \
              WHERE a.salinity IS NOT NULL \
              OR a.disolvedoxygen IS NOT NULL \
              OR a.nitrogen IS NOT NULL \
              OR a.water_temp IS NOT NULL \
              OR a.precipitation IS NOT NULL \
              OR a.depth IS NOT NULL \
              OR a.nitrate_nitrite IS NOT NULL \
              OR a.ammonium IS NOT NULL \
              OR a.orthophosphate IS NOT NULL \
              OR a.chlorophyll IS NOT NULL \
              OR a.phaeophytin IS NOT NULL'
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
                where r.Uid is not null and e.Name = " + "'" + req.params.name + "'"

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


// EXECUTE getParcelSums stored proc to retrieve parcel summations for selection
// EXAMPLE: 
// var townName = 'BARNSTABLE'
// var completeRings = '-7825103.056629799 5108269.629483548, -7824682.652974231 5106998.863888308, -7825389.6954858685 5106425.586176171, -7825962.973198006 5107572.141600447, -7825103.056629799 5108269.629483548'
// var data = {town: townName, rings: completeRings} // Pass complete polygon rings as object to API route
// var url = 'http://localhost:8081/api/getParcelSums/'
// $.ajax({
//   method: 'POST',
//   data: data,
//   contentType: 'application/json',
//   url: url
// })
// .done(function(response) {
                                
//   console.log(response)
// })
app.post('/api/getParcelSums/', function(req , res) {

  var query = 'exec getParcelSums ' + "'" + req.body.town + "', " + "'" + req.body.rings + "'"

  executeQuery (res, query, comchar_DBConfig);
});

// EXECUTE getParcelSums1MI stored proc to retrieve parcel summations within 1MI of selection
// EXAMPLE: 
// var townName = 'BARNSTABLE'
// var completeRings = '-7825103.056629799 5108269.629483548, -7824682.652974231 5106998.863888308, -7825389.6954858685 5106425.586176171, -7825962.973198006 5107572.141600447, -7825103.056629799 5108269.629483548'
// var data = {town: townName, rings: completeRings} // Pass town name and complete polygon rings as object to API route
// var url = 'http://localhost:8081/api/getParcelSums1MI/'
// $.ajax({
//   method: 'POST',
//   data: data,
//   contentType: 'application/json',
//   url: url
// })
// .done(function(response) {
                                
//   console.log(response)
// })
app.post('/api/getParcelSums1MI/', function(req , res) {

  var query = 'exec getParcelSums1MI ' + "'" + req.body.town + "', " + "'" + req.body.rings + "'"

  executeQuery (res, query, comchar_DBConfig);
});

// EXECUTE getParcelSumsROT stored proc to retrieve parcel summations within town and outside selection
// EXAMPLE: 
// var townName = 'BARNSTABLE'
// var completeRings = '-7825103.056629799 5108269.629483548, -7824682.652974231 5106998.863888308, -7825389.6954858685 5106425.586176171, -7825962.973198006 5107572.141600447, -7825103.056629799 5108269.629483548'
// var data = {town: townName, rings: completeRings} // Pass town name and complete polygon rings as object to API route
// var url = 'http://localhost:8081/api/getParcelSums/'
// $.ajax({
//   method: 'POST',
//   data: data,
//   contentType: 'application/json',
//   url: url
// })
// .done(function(response) {
                                
//   console.log(response)
// })
app.post('/api/getParcelSumsROT/', function(req , res) {

  var query = 'exec getParcelSumsROT ' + "'" + req.body.town + "', " + "'" + req.body.rings + "'"

  executeQuery (res, query, comchar_DBConfig);
});

// EXECUTE selectBlockGroups stored proc to retrieve intersecting block groups given intersecting parcel populations
// EXAMPLE: 
// var townName = 'BARNSTABLE'
// var completeRings = '-7825103.056629799 5108269.629483548, -7824682.652974231 5106998.863888308, -7825389.6954858685 5106425.586176171, -7825962.973198006 5107572.141600447, -7825103.056629799 5108269.629483548'
// var data = {town: townName, rings: completeRings} // Pass complete polygon rings as object to API route
// var url = 'http://localhost:8081/api/selectBlockGroups/'
// $.ajax({
//   method: 'POST',
//   data: data,
//   contentType: 'application/json',
//   url: url
// })
// .done(function(response) {
                                
//   console.log(response)
// })
app.post('/api/selectBlockGroups/', function(req , res) {

  var query = 'exec selectBlockGroups ' + "'" + req.body.town + "', " + "'" + req.body.rings + "'"

  executeQuery (res, query, comchar_DBConfig);
});

// EXECUTE selectBlockGroups1MI stored proc to retrieve intersecting block groups given intersecting parcel populations within 1MI
// EXAMPLE: 
// var townName = 'BARNSTABLE'
// var completeRings = '-7825103.056629799 5108269.629483548, -7824682.652974231 5106998.863888308, -7825389.6954858685 5106425.586176171, -7825962.973198006 5107572.141600447, -7825103.056629799 5108269.629483548'
// var data = {town: townName, rings: completeRings} // Pass complete polygon rings as object to API route
// var url = 'http://localhost:8081/api/selectBlockGroups1MI/'
// $.ajax({
//   method: 'POST',
//   data: data,
//   contentType: 'application/json',
//   url: url
// })
// .done(function(response) {
                                
//   console.log(response)
// })
app.post('/api/selectBlockGroups1MI/', function(req , res) {

  var query = 'exec selectBlockGroups1MI ' + "'" + req.body.town + "', " + "'" + req.body.rings + "'"

  executeQuery (res, query, comchar_DBConfig);
});

// EXECUTE selectBlockGroupsROT stored proc to retrieve block groups within the remainder of a town but outside of 1mi from the selection
// EXAMPLE: 
// var townName = 'BARNSTABLE'
// var completeRings = '-7825103.056629799 5108269.629483548, -7824682.652974231 5106998.863888308, -7825389.6954858685 5106425.586176171, -7825962.973198006 5107572.141600447, -7825103.056629799 5108269.629483548'
// var data = {town: townName, rings: completeRings} // Pass complete polygon rings as object to API route
// var url = 'http://localhost:8081/api/selectBlockGroupsROT/'
// $.ajax({
//   method: 'POST',
//   data: data,
//   contentType: 'application/json',
//   url: url
// })
// .done(function(response) {
                                
//   console.log(response)
// })
app.post('/api/selectBlockGroupsROT/', function(req , res) {

  var query = 'exec selectBlockGroupsROT ' + "'" + req.body.town + "', " + "'" + req.body.rings + "'"

  executeQuery (res, query, comchar_DBConfig);
});

// EXECUTE selectTracts stored proc to retrieve tract ids intersecting with the selection
// EXAMPLE: 
// var townName = 'BARNSTABLE'
// var completeRings = '-7825103.056629799 5108269.629483548, -7824682.652974231 5106998.863888308, -7825389.6954858685 5106425.586176171, -7825962.973198006 5107572.141600447, -7825103.056629799 5108269.629483548'
// var data = {town: townName, rings: completeRings} // Pass complete polygon rings as object to API route
// var url = 'http://localhost:8081/api/selectTracts/'
// $.ajax({
//   method: 'POST',
//   data: data,
//   contentType: 'application/json',
//   url: url
// })
// .done(function(response) {
                                
//   console.log(response)
// })
app.post('/api/selectTracts/', function(req , res) {

  var query = 'exec selectTracts ' + "'" + req.body.town + "', " + "'" + req.body.rings + "'"

  executeQuery (res, query, comchar_DBConfig);
});

// EXECUTE selectTracts1MI stored proc to retrieve tract ids intersecting parcel populations within 1MI
// EXAMPLE: 
// var townName = 'BARNSTABLE'
// var completeRings = '-7825103.056629799 5108269.629483548, -7824682.652974231 5106998.863888308, -7825389.6954858685 5106425.586176171, -7825962.973198006 5107572.141600447, -7825103.056629799 5108269.629483548'
// var data = {town: townName, rings: completeRings} // Pass complete polygon rings as object to API route
// var url = 'http://localhost:8081/api/selectTracts1MI/'
// $.ajax({
//   method: 'POST',
//   data: data,
//   contentType: 'application/json',
//   url: url
// })
// .done(function(response) {
                                
//   console.log(response)
// })
app.post('/api/selectTracts1MI/', function(req , res) {

  var query = 'exec selectTracts1MI ' + "'" + req.body.town + "', " + "'" + req.body.rings + "'"

  executeQuery (res, query, comchar_DBConfig);
});

// EXECUTE selectTractsROT stored proc to retrieve tracts within the remainder of a town but outside of 1mi from the selection
// EXAMPLE: 
// var townName = 'BARNSTABLE'
// var completeRings = '-7825103.056629799 5108269.629483548, -7824682.652974231 5106998.863888308, -7825389.6954858685 5106425.586176171, -7825962.973198006 5107572.141600447, -7825103.056629799 5108269.629483548'
// var data = {town: townName, rings: completeRings} // Pass complete polygon rings as object to API route
// var url = 'http://localhost:8081/api/selectTractsROT/'
// $.ajax({
//   method: 'POST',
//   data: data,
//   contentType: 'application/json',
//   url: url
// })
// .done(function(response) {
                                
//   console.log(response)
// })
app.post('/api/selectTractsROT/', function(req , res) {

  var query = 'exec selectTractsROT ' + "'" + req.body.town + "', " + "'" + req.body.rings + "'"

  executeQuery (res, query, comchar_DBConfig);
});


//******************************---Tech_Matrix DATABASE CALLS---******************************

// GET Technology_Matrix data from 'Tech_Matrix' DB where 'TM_ID' = ##
// EXAMPLE: Aquaculture - Shellfish Cultivated In Estuary Bed | http://sql-connect.api.capecodcommission.org/api/Technology_Matrix/11
app.get('/api/Technology_Matrix/:id', function(req , res) {

  var query = 'select * from dbo.Technology_Matrix WHERE TM_ID = ' + req.params.id;

  executeQuery (res, query, tm_DBConfig);
});

//******************************---US Census API CALLS---******************************

// GET Census Blocks (5th call) data from the US Census API where columns are listed after "=" in url string
// EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getBlks5
app.get('/api/getBlks5', function (req, res) {
  if (!req.params) {
    res.status(500);
    res.send({"Error": "Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested."});
    console.log("Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested.");
  }
  request.get({url:"https://api.census.gov/data/2016/acs/acs5?get=B17017_001E,B17017_002E,B11005_001E,B11005_002E,B25070_001E,B25070_007E,B25070_008E,B25070_009E,B25070_010E,B25070_011E,B25091_001E,B25091_008E,B25091_009E,B25091_010E,B25091_011E,B25091_012E,B25091_019E,B25091_020E,B25091_021E,B25091_022E,B25091_023E&for=block%20group:*&in=state:25%20county:001&key=8c7a3c5bf959c4358f3e0eee9b07cd95d7856f5c"},
  function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
  });
});

// GET Census Blocks (4th call) data from the US Census API where columns are listed after "=" in url string
// EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getBlks4
app.get('/api/getBlks4', function (req, res) {
  if (!req.params) {
    res.status(500);
    res.send({"Error": "Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested."});
    console.log("Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested.");
  }
  request.get({url:"https://api.census.gov/data/2016/acs/acs5?get=B25063_003E,B25063_004E,B25063_005E,B25063_006E,B25063_007E,B25063_008E,B25063_009E,B25063_010E,B25063_011E,B25063_012E,B25063_013E,B25063_014E,B25063_015E,B25063_016E,B25063_017E,B25063_018E,B25063_019E,B25063_020E,B25063_021E,B25063_022E,B25063_023E,B25063_024E,B25063_025E,B25063_026E&for=block%20group:*&in=state:25%20county:001&key=8c7a3c5bf959c4358f3e0eee9b07cd95d7856f5c"},
  function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
  });
});

// GET Census Blocks (3rd call) data from the US Census API where columns are listed after "=" in url string
// EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getBlks3
app.get('/api/getBlks3', function (req, res) {
  if (!req.params) {
    res.status(500);
    res.send({"Error": "Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested."});
    console.log("Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested.");
  }
  request.get({url:"https://api.census.gov/data/2016/acs/acs5?get=B25075_002E,B25075_003E,B25075_004E,B25075_005E,B25075_006E,B25075_007E,B25075_008E,B25075_009E,B25075_010E,B25075_011E,B25075_012E,B25075_013E,B25075_014E,B25075_015E,B25075_016E,B25075_017E,B25075_018E,B25075_019E,B25075_020E,B25075_021E,B25075_022E,B25075_023E,B25075_024E,B25075_025E,B25075_026E,B25075_027E&for=block%20group:*&in=state:25%20county:001&key=8c7a3c5bf959c4358f3e0eee9b07cd95d7856f5c"},
  function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
  });
});


var cachedHousing = []

// GET Census Blocks (2nd call) data from the US Census API where columns are listed after "=" in url string
// EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getBlks2
app.get('/api/getBlks2', cache('30 days'), function (req, res) {

  if (!req.params) {

    res.status(500);
    res.send({"Error": "Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested."});
    console.log("Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested.");
  }

  request.get({url:"https://api.census.gov/data/2016/acs/acs5?get=B25001_001E,B25004_006E,B25003_002E,B25003_003E,B25004_002E,B25004_003E,B25004_004E,B25004_005E,B25004_006E,B25004_007E,B25004_008E&for=block%20group:*&in=state:25%20county:001&key=8c7a3c5bf959c4358f3e0eee9b07cd95d7856f5c"},
  function(error, response, body) {

    if (!error && response.statusCode == 200) {

      var jsonBody = JSON.parse(body)

      cachedHousing = jsonBody
    }
  });
});

app.post('/api/getCachedHousing', cache('30 days'), function (req, res) {

  var filteredArray = cachedHousing.filter((el => {

    return req.body.idArray.includes(el[13] + el[14])
  }))

  var totalHousingSelected = 0 
  var totalSeasonalSelected = 0
  var totalOwnOccpSelected = 0
  var totalRntOccpSelected = 0
  var totalForRentSelected = 0
  var totalRntNotOccSelected = 0
  var totalForSaleSelected = 0
  var totalSoldNotOccSelected = 0
  var totalSeaRecOccSelected = 0
  var totalMigrantSelected = 0
  var totalOtherVacSelected = 0

  filteredArray.map((k) => {

    totalHousingSelected += parseInt(k[0])
    totalSeasonalSelected += parseInt(k[1]) // Append/fill census attributes by column index
    totalOwnOccpSelected += parseInt(k[2])
    totalRntOccpSelected += parseInt(k[3])
    totalForRentSelected += parseInt(k[4])
    totalRntNotOccSelected += parseInt(k[5])
    totalForSaleSelected += parseInt(k[6])
    totalSoldNotOccSelected += parseInt(k[7])
    totalSeaRecOccSelected += parseInt(k[8])
    totalMigrantSelected += parseInt(k[9])
    totalOtherVacSelected += parseInt(k[10])
  })

  var newObject = {

    totalHousing: totalHousingSelected,
    totalSeasonal: totalSeasonalSelected
  }

  res.send(newObject)
});

// GET Census Blocks (1st call) data from the US Census API where columns are listed after "=" in url string
// EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getBlks
app.get('/api/getBlks', function (req, res) {
  if (!req.params) {
    res.status(500);
    res.send({"Error": "Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested."});
    console.log("Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested.");
  }
  request.get({url:"https://api.census.gov/data/2016/acs/acs5?get=B25001_001E,B01003_001E,B19001_002E,B19001_003E,B19001_004E,B19001_005E,B19001_006E,B19001_007E,B19001_008E,B19001_009E,B19001_010E,B19001_011E,B19001_012E,B19001_013E,B19001_014E,B19001_015E,B19001_016E,B19001_017E,B23025_003E,B23025_005E,B15003_001E,B15003_002E,B15003_003E,B15003_004E,B15003_005E,B15003_006E,B15003_007E,B15003_008E,B15003_009E,B15003_010E,B15003_011E,B15003_012E,B15003_013E,B15003_014E,B15003_015E,B15003_016E,B15003_017E,B15003_018E,B15003_019E,B15003_020E,B15003_021E,B15003_022E,B15003_023E,B15003_024E,B15003_025E,B20004_002E,B20004_003E,B20004_004E,B20004_005E,B20004_006E&for=block%20group:*&in=state:25%20county:001&key=8c7a3c5bf959c4358f3e0eee9b07cd95d7856f5c"},
  function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
  });
});

// GET Tracts (1st call) data from the US Census API where columns are listed after "=" in url string
// EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getTracts
app.get('/api/getTracts', function (req, res) {

  if (!req.params) {

    res.status(500);
    res.send({"Error": "Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested."});
    console.log("Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested.");
  }

  request.get({url:"https://api.census.gov/data/2016/acs/acs5?get=B25001_001E,B01003_001E,B19001_002E,B19001_003E,B19001_004E,B19001_005E,B19001_006E,B19001_007E,B19001_008E,B19001_009E,B19001_010E,B19001_011E,B19001_012E,B19001_013E,B19001_014E,B19001_015E,B19001_016E,B19001_017E,B20004_002E,B20004_003E,B20004_004E,B20004_005E,B20004_006E,B23025_003E,B23025_005E,B15003_001E,B15003_002E,B15003_003E,B15003_004E,B15003_005E,B15003_006E,B15003_007E,B15003_008E,B15003_009E,B15003_010E,B15003_011E,B15003_012E,B15003_013E,B15003_014E,B15003_015E,B15003_016E,B15003_017E,B15003_018E,B15003_019E,B15003_020E,B15003_021E,B15003_022E,B15003_023E,B15003_024E,B15003_025E&for=tract:012600&in=state:25%20county:001&key=8c7a3c5bf959c4358f3e0eee9b07cd95d7856f5c"},
  function(error, response, body) {

    if (!error && response.statusCode == 200) {

      res.send(body);
    }
  });
});

// GET Tracts (2nd call) data from the US Census API where columns are listed after "=" in url string
// EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getTracts2
app.get('/api/getTracts2', function (req, res) {
  if (!req.params) {
    res.status(500);
    res.send({"Error": "Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested."});
    console.log("Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested.");
  }
  request.get({url:"https://api.census.gov/data/2016/acs/acs5?get=B25001_001E,B25004_006E&for=tract:*&in=state:25%20county:001&key=8c7a3c5bf959c4358f3e0eee9b07cd95d7856f5c"},
  function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
  });
});

// GET Census Towns data from the US Census API where columns are listed after "=" in url string
// EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getCensusTowns
app.get('/api/getCensusTowns', function (req, res) {

  if (!req.params) {

    res.status(500);
    res.send({"Error": "Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested."});
    console.log("Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested.");
  }

  request.get({url:"https://api.census.gov/data/2016/acs/acs5?get=NAME,B01003_001E,B19001_002E,B19001_003E,B19001_004E,B19001_005E,B19001_006E,B19001_007E,B19001_008E,B19001_009E,B19001_010E,B19001_011E,B19001_012E,B19001_013E,B19001_014E,B19001_015E,B19001_016E,B19001_017E,B20004_002E,B20004_003E,B20004_004E,B20004_005E,B20004_006E,B23025_003E,B23025_005E,B15003_001E,B15003_002E,B15003_003E,B15003_004E,B15003_005E,B15003_006E,B15003_007E,B15003_008E,B15003_009E,B15003_010E,B15003_011E,B15003_012E,B15003_013E,B15003_014E,B15003_015E,B15003_016E,B15003_017E,B15003_018E,B15003_019E,B15003_020E,B15003_021E,B15003_022E,B15003_023E,B15003_024E,B15003_025E&for=county%20subdivision:*&in=state:25%20county:001&key=8c7a3c5bf959c4358f3e0eee9b07cd95d7856f5c"},
  
  function(error, response, body) {

    if (!error && response.statusCode == 200) {

      res.send(body);
    }
  });
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
