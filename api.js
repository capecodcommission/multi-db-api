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
  requestTimeout: 300000,
  connectionTimeout: 300000,
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
  requestTimeout: 300000,
  connectionTimeout: 300000,
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
  requestTimeout: 300000,
  connectionTimeout: 300000,
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
  requestTimeout: 300000,
  connectionTimeout: 300000,
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 300000
  }
};

var comCharConnect = new sql.ConnectionPool(comchar_DBConfig)
var wmvp3Connect = new sql.ConnectionPool(wmvp3_DBConfig)
var tmConnect = new sql.ConnectionPool(tm_DBConfig)
var wqmConnect = new sql.ConnectionPool(wqm_DBConfig)

comCharConnect.connect(err => {
  if (err) {
    console.log("comCharConnect error -->", err)
  }
})

wmvp3Connect.connect(err => {
  if (err) {
    console.log("wmvp3Connect error -->", err)
  }
})

tmConnect.connect(err => {
  if (err) {
    console.log("tmConnect error -->", err)
  }
})

wqmConnect.connect(err => {
  if (err) {
    console.log("wqmConnect error -->", err)
  }
})


// Estbalish a ScenarioWizQuery f(x) to connect to 'wMVP3_CapeCodMA' & get a response
var  executeQuery = function (res, query, connection) {

  var request = new sql.Request(connection)

  request.query(query).then(response => {

    res.send(response)
  })
}

//******************************---wMVP3_CapeCodMA DATABASE CALLS---******************************

//GET ScenarioWiz data from 'wMVP3_CapeCodMA' DB where scenario id = ##
//EXAMPLE: SCENARIO ID 2727 | http://sql-connect.api.capecodcommission.org/api/ScenarioWiz/2727
app.get('/api/ScenarioWiz/:id', function(req , res) {

  var query = 'select * from CapeCodMA.Scenario_Wiz where ScenarioID = ' + req.params.id;

  executeQuery (res, query, wmvp3Connect);
});

//GET TreatmentWiz data from 'wMVP3_CapeCodMA' DB where scenario id = ##
//EXAMPLE: SCENARIO ID 2727 | http://sql-connect.api.capecodcommission.org/api/TreatmentWiz/2727
app.get('/api/TreatmentWiz/:id', function(req , res) {

  var query = 'select * from CapeCodMA.Treatment_Wiz where ScenarioID = ' + req.params.id;

  executeQuery (res, query, wmvp3Connect);
});

//GET Embayments table from 'wMVP3_CapeCodMA' DB
//EXAMPLE: http://sql-connect.api.capecodcommission.org/api/Embayments
app.get('/api/Embayments', function(req , res) {

  var query = 'select * from CapeCodMA.Embayments';

  executeQuery (res, query, wmvp3Connect);
});

//GET FTCoeff table from 'wMVP3_CapeCodMA' DB
//EXAMPLE: http://sql-connect.api.capecodcommission.org/api/FTCoeff
app.get('/api/FTCoeff', function(req , res) {

  var query = 'select * from CapeCodMA.FTCoeff';

  executeQuery (res, query, wmvp3Connect);
});

//GET MATowns from 'wMVP3_CapeCodMA' DB
//EXAMPLE: http://sql-connect.api.capecodcommission.org/api/MATowns
app.get('/api/MATowns', function(req , res) {

  var query = 'select * from CapeCodMA.MATowns';

  executeQuery (res, query, wmvp3Connect);
});

//GET SubEmbayments from 'wMVP3_CapeCodMA' DB
//EXAMPLE: http://sql-connect.api.capecodcommission.org/api/SubEmbayments
app.get('/api/SubEmbayments', function(req , res) {

  var query = 'select * from CapeCodMA.SubEmbayments';

  executeQuery (res, query, wmvp3Connect);
});

//GET Subwatersheds from 'wMVP3_CapeCodMA' DB
//EXAMPLE: http://sql-connect.api.capecodcommission.org/api/Subwatersheds
app.get('/api/Subwatersheds', function(req , res) {

  var query = 'select * from CapeCodMA.Subwatersheds';

  executeQuery (res, query, wmvp3Connect);
});

//GET parcelMaster data from 'wMVP3_CapeCodMA' DB where scenario id = ##
//EXAMPLE: SCENARIO ID 2488 | http://sql-connect.api.capecodcommission.org/api/parcelMaster/2488
app.get('/api/parcelMaster/:id', function(req , res) {

  var query = 'select * from CapeCodMA.parcelMaster WHERE scenario_id = ' + req.params.id;

  executeQuery (res, query, wmvp3Connect);
});

//GET wiz_treatment_towns data from 'wMVP3_CapeCodMA' DB where scenario id = ##
//EXAMPLE: SCENARIO ID 2488 | http://sql-connect.api.capecodcommission.org/api/wiz_treatment_towns/2488
app.get('/api/wiz_treatment_towns/:id', function(req , res) {

  var query = 'select * from dbo.wiz_treatment_towns WHERE wtt_scenario_id = ' + req.params.id;

  executeQuery (res, query, wmvp3Connect);
});


//GET WastewaterSource3 data from 'wMVP3_CapeCodMA' DB where municipal id = ##
//EXAMPLE: SCENARIO ID 224 | http://sql-connect.api.capecodcommission.org/api/WastewaterSource3/224
app.get('/api/WastewaterSource3/:id', function(req , res) {

  var query = 'select * from dbo.WastewaterSource3 WHERE Muni_ID = ' + req.params.id;

  executeQuery (res, query, wmvp3Connect);
});

//GET ParcelCharacteristics data from 'wMVP3_CapeCodMA' DB where municipal id = ##
//EXAMPLE: SCENARIO ID 224 | http://sql-connect.api.capecodcommission.org/api/ParcelCharacteristics/224
app.get('/api/ParcelCharacteristics/:id', function(req , res) {

  var query = 'select * from dbo.ParcelCharacteristics WHERE Muni_ID = ' + req.params.id;

  executeQuery (res, query, wmvp3Connect);
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

  executeQuery (res, query, wqmConnect);
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
  executeQuery (res, query, wqmConnect);
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

  executeQuery (res, query, wqmConnect);
});

//GET Embayment data from 'WaterQualityMonitoring' where embayment id is not null & embayment is in Barnstable County (Cape Cod)
//EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getEmbayments/
app.get('/api/getEmbayments', function(req , res) {

  var query = 'select id as EMBAYMENT_ID, Name as EMBAYMENT from dbo.Embayment where id is not null and id < 160'

  executeQuery (res, query, wqmConnect);
});

//******************************---CommunityCharacteristics DATABASE CALLS---******************************

//GET Neighborhood Name data from 'commchar_0815' table in 'CommunityCharacteristics' DB
//EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getNeighborhoods
app.get('/api/getNeighborhoods', function(req , res) {

  var query = "select distinct Neighborhood from dbo.commchar_0815 where Neighborhood != ''"

  executeQuery (res, query, comCharConnect);
});

//GET Activity Center Name data from 'commchar_0815' table in 'CommunityCharacteristics' DB
//EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getActivityCenters
app.get('/api/getActivityCenters', function(req , res) {

  var query = "select distinct AC_FINAL as center from dbo.commchar_0815 where AC_FINAL != ''"

  executeQuery (res, query, comCharConnect);
});

//GET Town Name data from 'commchar_0815' table in 'CommunityCharacteristics' DB
//EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getTowns
app.get('/api/getTowns', function(req , res) {

  var query = "select distinct Town as town from dbo.commchar_0815 where Town != ''"

  executeQuery (res, query, comCharConnect);
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

  executeQuery (res, query, comCharConnect);
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

  executeQuery (res, query, comCharConnect);
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

  executeQuery (res, query, comCharConnect);
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

  executeQuery (res, query, comCharConnect);
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

  executeQuery (res, query, comCharConnect);
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

  executeQuery (res, query, comCharConnect);
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

  executeQuery (res, query, comCharConnect);
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

  executeQuery (res, query, comCharConnect);
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

  executeQuery (res, query, comCharConnect);
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

  executeQuery (res, query, comCharConnect);
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

  executeQuery (res, query, comCharConnect);
});


//******************************---Tech_Matrix DATABASE CALLS---******************************

// GET Technology_Matrix data from 'Tech_Matrix' DB where 'TM_ID' = ##
// EXAMPLE: Aquaculture - Shellfish Cultivated In Estuary Bed | http://sql-connect.api.capecodcommission.org/api/Technology_Matrix/11
app.get('/api/Technology_Matrix/:id', function(req , res) {

  var query = 'select * from dbo.Technology_Matrix WHERE TM_ID = ' + req.params.id;

  executeQuery (res, query, tmConnect);
});

//******************************---US Census API CALLS---******************************

// Initialize global census objects whose contents will be cached for 30 days
var globalCenusData = [];
var globalCensusIncomeEmploymentEducation = [];
var globalCensusHousingOcc = [];
var globalCensusHomePrice = [];
var globalCensusRent = [];
var globalCensusEduTract = [];
var globalCensusEduTown = [];
var globalCensusAffordability = [];
var globalCensusAge = [];

// Initialize pareto interpolation functions
function calc_MedianIncome(incomeData) {

  // Obtain upper bounds for each income bin along with sample population total
  var bucketTops = [10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000, 75000, 100000, 125000, 150000, 200000]
  var total =  incomeData[0]

  // Initialize variables to be conditionally filled
  var lowerBucket = 0
  var upperBucket = 0
  var lowerBin = 0
  var lowerSum = 0
  var upperBin = 0
  var upperSum = 0
  var lowerPerc = 0
  var upperPerc = 0
  var lowerIncome = 0
  var upperIncome = 0

  var sampleMedian = 0
  var thetaHat = 0
  var kHat = 0

  // Start with second smallest income bin, skipping the first element (total population), and second element (smallest income bin)
  for (var i = 2; i < 17; i++) {

    var bin = incomeData.slice(1,i) // Subset array starting from smallest income bin to ith element
    var binSum = bin.reduce((a,b) => {return a + b}) // Sum subset array
    var halfTotal = total / 2.0

    // If the summed subset array is greater than half the sample population
    if (binSum > halfTotal) {

      lowerBucket = i - 2 // Set lower/upper bucket bounds
      upperBucket = i - 1

      if (i == 16) { // Break loop if at final income bin

        break
      } else {

        // Create further lower/upper bounds expressed as sample proportions (%)
        lowerBin = incomeData.slice(1,lowerBucket+1)
        lowerSum = lowerBin.reduce((a,b) => {return a + b})

        upperBin = incomeData.slice(1,upperBucket+1)
        upperSum = upperBin.reduce((a,b) => {return a + b})

        lowerPerc = lowerSum / total
        upperPerc = upperSum / total

        lowerIncome = bucketTops[lowerBucket - 1]
        upperIncome = bucketTops[upperBucket - 1]
        break
      }
    }

    if (i == 16) { // return highest income bin if proportion condition unmet

      console.log('i == 16')

      return 200000
    }
  } // end loop

  if (lowerPerc == 0.0) { // Use simple sample median calculation if lower bound proportion at zero, otherise interpolate

    console.log('lowerperc is 0')

    sampleMedian = lowerIncome + ((upperIncome - lowerIncome) / 2.0)
  } else {

    // Estimate theta (Pareto Index) ("distribution tail thinness") (Larger value indicates smaller proportion of incomes significantly larger than the lowest allowable income)
    // Estimate k (Lowest allowable income in population)
    thetaHat = (Math.log(1.0 - lowerPerc) - Math.log(1.0 - upperPerc)) / (Math.log(upperIncome) - Math.log(lowerIncome))
    kHat = Math.pow( (upperPerc - lowerPerc) / ( (1/Math.pow(lowerIncome,thetaHat)) - (1/Math.pow(upperIncome,thetaHat)) ), (1/thetaHat) )
    sampleMedian = (kHat * Math.pow(2,(1/thetaHat)))
  }

  var output = parseInt(sampleMedian.toFixed())

  return output.toLocaleString() // Add thousands separator
}

function calc_MedianHomePrice(priceData) {

  // Obtain upper bounds for each price bin along with sample population total
  var bucketTops = [10000, 15000, 20000, 25000, 30000, 35000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 125000, 150000, 175000, 200000, 250000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000]
  var total =  priceData[0]

  // Initialize variables to be conditionally filled
  var lowerBucket = 0
  var upperBucket = 0
  var lowerBin = 0
  var lowerSum = 0
  var upperBin = 0
  var upperSum = 0
  var lowerPerc = 0
  var upperPerc = 0
  var lowerIncome = 0
  var upperIncome = 0

  var sampleMedian = 0
  var thetaHat = 0
  var kHat = 0

  // Start with second smallest price bin, skipping the 0th element (total price), and 1st element (smallest price bin)
  for (var i = 2; i < 26; i++) {

    var bin = priceData.slice(1,i) // Subset array starting from smallest price bin to ith element
    var binSum = bin.reduce((a,b) => {return a + b}) // Sum subset array
    var halfTotal = total / 2.0

    // If the summed subset array is greater than half the sample population
    if (binSum > halfTotal) {

      lowerBucket = i - 2 // Set lower/upper bucket bounds
      upperBucket = i - 1

      if (i == 25) { // Break loop if at final income bin

        break
      } else {

        // Create further lower/upper bounds expressed as sample proportions (%)
        lowerBin = priceData.slice(1,lowerBucket+1)
        lowerSum = lowerBin.reduce((a,b) => {return a + b})

        upperBin = priceData.slice(1,upperBucket+1)
        upperSum = upperBin.reduce((a,b) => {return a + b})

        lowerPerc = lowerSum / total
        upperPerc = upperSum / total

        lowerIncome = bucketTops[lowerBucket - 1]
        upperIncome = bucketTops[upperBucket - 1]
        break
      }
    }

    if (i == 25) { // return highest price bin if proportion condition unmet

      console.log('i == 25')

      return 2000000
    }
  } // end loop

  if (lowerPerc == 0.0) { // Use simple sample median calculation if lower bound proportion at zero, otherise interpolate

    console.log('lowerperc is 0')

    sampleMedian = lowerIncome + ((upperIncome - lowerIncome) / 2.0)
  } else {

    // Estimate theta (Pareto Index) ("distribution tail thinness") (Larger value indicates smaller proportion of prices significantly larger than the lowest allowable price)
    // Estimate k (Lowest allowable price in population)
    thetaHat = (Math.log(1.0 - lowerPerc) - Math.log(1.0 - upperPerc)) / (Math.log(upperIncome) - Math.log(lowerIncome))
    kHat = Math.pow( (upperPerc - lowerPerc) / ( (1/Math.pow(lowerIncome,thetaHat)) - (1/Math.pow(upperIncome,thetaHat)) ), (1/thetaHat) )
    sampleMedian = (kHat * Math.pow(2,(1/thetaHat)))
  }

  var output = parseInt(sampleMedian.toFixed())

  return output.toLocaleString() // Add thousands separator
}

function calc_MedianRent(rentData) {

  // Obtain upper bounds for each rental bin along with sample population total
  var bucketTops = [100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 900, 1000, 1250, 1500, 2000, 2500, 3000, 3500]
  var total =  rentData[0]

  // Initialize variables to be conditionally filled
  var lowerBucket = 0
  var upperBucket = 0
  var lowerBin = 0
  var lowerSum = 0
  var upperBin = 0
  var upperSum = 0
  var lowerPerc = 0
  var upperPerc = 0
  var lowerIncome = 0
  var upperIncome = 0

  var sampleMedian = 0
  var thetaHat = 0
  var kHat = 0

  // Start with second smallest rental bin, skipping the 0th element (total rent), and 1st element (smallest rental bin)
  for (var i = 2; i < 24; i++) {

    var bin = rentData.slice(1,i) // Subset array starting from smallest rental bin to ith element
    var binSum = bin.reduce((a,b) => {return a + b}) // Sum subset array
    var halfTotal = total / 2.0

    // If the summed subset array is greater than half the sample population
    if (binSum > halfTotal) {

      lowerBucket = i - 2 // Set lower/upper bucket bounds
      upperBucket = i - 1

      if (i == 23) { // Break loop if at final rental bin

        break
      } else {

        // Create further lower/upper bounds expressed as sample proportions (%)
        lowerBin = rentData.slice(1,lowerBucket+1)
        lowerSum = lowerBin.reduce((a,b) => {return a + b})

        upperBin = rentData.slice(1,upperBucket+1)
        upperSum = upperBin.reduce((a,b) => {return a + b})

        lowerPerc = lowerSum / total
        upperPerc = upperSum / total

        lowerIncome = bucketTops[lowerBucket - 1]
        upperIncome = bucketTops[upperBucket - 1]
        break
      }
    }

    if (i == 23) { // return highest rental bin if proportion condition unmet

      console.log('i == 23')

      return 3500
    }
  } // end loop

  if (lowerPerc == 0.0) { // Use simple sample median calculation if lower bound proportion at zero, otherise interpolate

    console.log('lowerperc is 0')

    sampleMedian = lowerIncome + ((upperIncome - lowerIncome) / 2.0)
  } else {

    // Estimate theta (Pareto Index) ("distribution tail thinness") (Larger value indicates smaller proportion of incomes significantly larger than the lowest allowable income)
    // Estimate k (Lowest allowable income in population)
    thetaHat = (Math.log(1.0 - lowerPerc) - Math.log(1.0 - upperPerc)) / (Math.log(upperIncome) - Math.log(lowerIncome))
    kHat = Math.pow( (upperPerc - lowerPerc) / ( (1/Math.pow(lowerIncome,thetaHat)) - (1/Math.pow(upperIncome,thetaHat)) ), (1/thetaHat) )
    sampleMedian = (kHat * Math.pow(2,(1/thetaHat)))
  }

  var output = parseInt(sampleMedian.toFixed())

  return output.toLocaleString() // Add thousands separator
}

// Creates a cache of Census population age data at the Block Group level from the US Census API where columns are listed after "=" in url string.
// Locally, this GET request must be run prior to posting to '/api/getCensusAgeTotals' to store the cached data in 'globalCensusAge'.
// On 'api-app-05', this must be executed once every 30 days.
// EXAMPLE: http://sql-connect.api.capecodcommission.org/api/cacheCensusAge
app.get('/api/cacheCensusAge', cache('30 days'), function (req, res) {

  if (!req.params) {

    res.status(500);
    res.send({"Error": "Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested."});
    console.log("Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested.");
  }
  request.get({url:"https://api.census.gov/data/2016/acs/acs5?get=B01001_003E,B01001_004E,B01001_005E,B01001_006E,B01001_007E,B01001_027E,B01001_028E,B01001_029E,B01001_030E,B01001_031E,B01001_008E,B01001_009E,B01001_010E,B01001_011E,B01001_012E,B01001_013E,B01001_014E,B01001_032E,B01001_033E,B01001_034E,B01001_035E,B01001_036E,B01001_037E,B01001_038E,B01001_015E,B01001_016E,B01001_017E,B01001_018E,B01001_019E,B01001_039E,B01001_040E,B01001_041E,B01001_042E,B01001_043E,B01001_020E,B01001_021E,B01001_022E,B01001_023E,B01001_024E,B01001_025E,B01001_044E,B01001_045E,B01001_046E,B01001_047E,B01001_048E,B01001_049E&for=block%20group:*&in=state:25%20county:001&key=8c7a3c5bf959c4358f3e0eee9b07cd95d7856f5c"},
  function(error, response, body) {

    if (!error && response.statusCode == 200) {

      var jsonBody = JSON.parse(body)

      globalCensusAge = jsonBody
    }
  });
});

// Creates a cache of Census affordability (poverty, renting, and mortgage) data at the Block Group level from the US Census API where columns are listed after "=" in url string.
// Locally, this GET request must be run prior to posting to '/api/getCensusAffordabilityTotals' to store the cached data in 'globalCensusAffordability'.
// On 'api-app-05', this must be executed once every 30 days.
// EXAMPLE: http://sql-connect.api.capecodcommission.org/api/cacheCensusAffordability
app.get('/api/cacheCensusAffordability', cache('30 days'), function (req, res) {

  if (!req.params) {

    res.status(500);
    res.send({"Error": "Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested."});
    console.log("Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested.");
  }
  request.get({url:"https://api.census.gov/data/2016/acs/acs5?get=B17017_001E,B17017_002E,B11005_001E,B11005_002E,B25070_001E,B25070_007E,B25070_008E,B25070_009E,B25070_010E,B25070_011E,B25091_001E,B25091_008E,B25091_009E,B25091_010E,B25091_011E,B25091_012E,B25091_019E,B25091_020E,B25091_021E,B25091_022E,B25091_023E&for=block%20group:*&in=state:25%20county:001&key=8c7a3c5bf959c4358f3e0eee9b07cd95d7856f5c"},
  function(error, response, body) {

    if (!error && response.statusCode == 200) {

      var jsonBody = JSON.parse(body)

      globalCensusAffordability = jsonBody
    }
  });
});

// Creates a cache of Census Home price data at the Block Group level from the US Census API where columns are listed after "=" in url string.
// Locally, this GET request must be run prior to posting to '/api/getCensusHomePriceTotals' to store the cached data in 'globalCensusHomePrice'.
// On 'api-app-05', this must be executed once every 30 days.
// EXAMPLE: http://sql-connect.api.capecodcommission.org/api/cacheCensusHomePrice
app.get('/api/cacheCensusRent', cache('30 days'), function (req, res) {

  if (!req.params) {

    res.status(500);
    res.send({"Error": "Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested."});
  }

  request.get({url:"https://api.census.gov/data/2016/acs/acs5?get=B25063_003E,B25063_004E,B25063_005E,B25063_006E,B25063_007E,B25063_008E,B25063_009E,B25063_010E,B25063_011E,B25063_012E,B25063_013E,B25063_014E,B25063_015E,B25063_016E,B25063_017E,B25063_018E,B25063_019E,B25063_020E,B25063_021E,B25063_022E,B25063_023E,B25063_024E,B25063_025E,B25063_026E&for=block%20group:*&in=state:25%20county:001&key=8c7a3c5bf959c4358f3e0eee9b07cd95d7856f5c"},
  function(error, response, body) {

    if (!error && response.statusCode == 200) {

      var jsonBody = JSON.parse(body)

      globalCensusRent = jsonBody
    }
  });
});

// Creates a cache of Census Home price data at the Block Group level from the US Census API where columns are listed after "=" in url string.
// Locally, this GET request must be run prior to posting to '/api/getCensusHomePriceTotals' to store the cached data in 'globalCensusHomePrice'.
// On 'api-app-05', this must be executed once every 30 days.
// EXAMPLE: http://sql-connect.api.capecodcommission.org/api/cacheCensusHomePrice
app.get('/api/cacheCensusHomePrice', cache('30 days'), function (req, res) {

  if (!req.params) {

    res.status(500);
    res.send({"Error": "Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested."});
  }

  request.get({url:"https://api.census.gov/data/2016/acs/acs5?get=B25075_002E,B25075_003E,B25075_004E,B25075_005E,B25075_006E,B25075_007E,B25075_008E,B25075_009E,B25075_010E,B25075_011E,B25075_012E,B25075_013E,B25075_014E,B25075_015E,B25075_016E,B25075_017E,B25075_018E,B25075_019E,B25075_020E,B25075_021E,B25075_022E,B25075_023E,B25075_024E,B25075_025E,B25075_026E,B25075_027E&for=block%20group:*&in=state:25%20county:001&key=8c7a3c5bf959c4358f3e0eee9b07cd95d7856f5c"},
  function(error, response, body) {

    if (!error && response.statusCode == 200) {

      var jsonBody = JSON.parse(body)

      globalCensusHomePrice = jsonBody
    }
  });
});

// Creates a cache of Census Housing Occupancy data at the Block Group level from the US Census API where columns are listed after "=" in url string.
// Locally, this GET request must be run prior to posting to '/api/getCensusHousingOccTotals' to store the cached data in 'globalCensusHousingOcc'.
// On 'api-app-05', this must be executed once every 30 days.
// EXAMPLE: http://sql-connect.api.capecodcommission.org/api/cacheCensusHousingOcc
app.get('/api/cacheCensusHousingOcc', cache('30 days'), function (req, res) {

  if (!req.params) {

    res.status(500);
    res.send({"Error": "Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested."});
    console.log("Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested.");
  }

  request.get({url:"https://api.census.gov/data/2016/acs/acs5?get=B25001_001E,B25004_006E,B25003_002E,B25003_003E,B25004_002E,B25004_003E,B25004_004E,B25004_005E,B25004_006E,B25004_007E,B25004_008E&for=block%20group:*&in=state:25%20county:001&key=8c7a3c5bf959c4358f3e0eee9b07cd95d7856f5c"},
  function(error, response, body) {

    if (!error && response.statusCode == 200) {

      var jsonBody = JSON.parse(body)

      globalCensusHousingOcc = jsonBody
    }
  });
});

// Creates a cache of Census Income, Employment & Education data at the Block Group level from the US Census API where columns are listed after "=" in url string.
// Locally, this GET request must be run prior to posting to '/api/getCensusIncomeEmploymentEducationTotals' to store the cached data in 'globalCensusHousingOcc'.
// On 'api-app-05', this must be executed once every 30 days.
// EXAMPLE: http://sql-connect.api.capecodcommission.org/api/cacheCensusIncomeEmploymentEducation
app.get('/api/cacheCensusIncomeEmploymentEducation', cache('30 days'), function (req, res) {

  if (!req.params) {

    res.status(500);
    res.send({"Error": "Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested."});
    console.log("Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested.");
  }

  request.get({url:"https://api.census.gov/data/2016/acs/acs5?get=B25001_001E,B01003_001E,B19001_002E,B19001_003E,B19001_004E,B19001_005E,B19001_006E,B19001_007E,B19001_008E,B19001_009E,B19001_010E,B19001_011E,B19001_012E,B19001_013E,B19001_014E,B19001_015E,B19001_016E,B19001_017E,B23025_003E,B23025_005E,B15003_001E,B15003_002E,B15003_003E,B15003_004E,B15003_005E,B15003_006E,B15003_007E,B15003_008E,B15003_009E,B15003_010E,B15003_011E,B15003_012E,B15003_013E,B15003_014E,B15003_015E,B15003_016E,B15003_017E,B15003_018E,B15003_019E,B15003_020E,B15003_021E,B15003_022E,B15003_023E,B15003_024E,B15003_025E,B20004_002E,B20004_003E,B20004_004E,B20004_005E,B20004_006E&for=block%20group:*&in=state:25%20county:001&key=8c7a3c5bf959c4358f3e0eee9b07cd95d7856f5c"},
  function(error, response, body) {

    if (!error && response.statusCode == 200) {

      var jsonBody = JSON.parse(body)

      globalCensusIncomeEmploymentEducation = jsonBody
    }
  });
});

// Creates a cache of Census Education data at the Tract level from the US Census API where columns are listed after "=" in url string.
// Locally, this GET request must be run prior to posting to '/api/getCensusEduTractTotals' to store the cached data in 'globalCensusEduTract'.
// On 'api-app-05', this must be executed once every 30 days.
// EXAMPLE: http://sql-connect.api.capecodcommission.org/api/cacheCensusEduTract
app.get('/api/cacheCensusEduTract', cache('30 days'), function (req, res) {

  if (!req.params) {

    res.status(500);
    res.send({"Error": "Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested."});
    console.log("Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested.");
  }

  request.get({url:"https://api.census.gov/data/2016/acs/acs5?get=B20004_002E,B20004_003E,B20004_004E,B20004_005E,B20004_006E&for=tract:*&in=state:25%20county:001&key=8c7a3c5bf959c4358f3e0eee9b07cd95d7856f5c"},
  function(error, response, body) {

    if (!error && response.statusCode == 200) {

      var jsonBody = JSON.parse(body)

      globalCensusEduTract = jsonBody
    }
  });
});

// Creates a cache of Census Education data at the Town level from the US Census API where columns are listed after "=" in url string.
// Locally, this GET request must be run prior to posting to '/api/getCensusEduTownTotals' to store the cached data in 'globalCensusEduTown'.
// On 'api-app-05', this must be executed once every 30 days.
// EXAMPLE: http://sql-connect.api.capecodcommission.org/api/cacheCensusEduTown
app.get('/api/cacheCensusEduTown', cache('30 days'), function (req, res) {

  if (!req.params) {

    res.status(500);
    res.send({"Error": "Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested."});
    console.log("Looks like something went wrong with the request. Check the url for the request to see if it's constructed incorrectly or if there are too many columns requested.");
  }

  request.get({url:"https://api.census.gov/data/2016/acs/acs5?get=NAME,B20004_002E,B20004_003E,B20004_004E,B20004_005E,B20004_006E&for=county%20subdivision:*&in=state:25%20county:001&key=8c7a3c5bf959c4358f3e0eee9b07cd95d7856f5c"},

  function(error, response, body) {

    if (!error && response.statusCode == 200) {

      var jsonBody = JSON.parse(body)

      jsonBody.map((i) => {

        // Reduce subdivision string to town name, then uppercase to match with parcel layer town name
        i[0] = i[0].substr(0,i[0].indexOf(' ')).toUpperCase()

        return i
      })

      globalCensusEduTown = jsonBody
    }
  });
});

// Creates a new data object, 'censusAffordabilityData', holding Census poverty, renting, and mortgage totals data. This is added to 'globalCenusData'.
// Locally, this POST request must be run following running '/api/cacheCensusRent' to store the cached data in 'globalCensusAffordability'.
// On 'api-app-05', this can only be executed following the execution of '/api/cacheCensusRent', which happens every 30 days.
// POST: {"idArray": ["0131001","0129001"]} <-- {"idArray": ["TRACT+BLKGRP","TRACT+BLKGRP"]} | EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getCensusAffordabilityTotals
app.post('/api/getCensusAffordabilityTotals', function (req, res) {

  var filteredArray = globalCensusAffordability.filter((el) => {

    return req.body.includes(el[23] + el[24])
  })

  // Poverty
  var totalHouseholdsBelowPoverty = 0 // US Census column ABC###
  var totalIncomeBelowPoverty = 0

  // Age
  var totalHouseholdsUnder18 = 0
  var totalOneOrMore18 = 0

  // Renting
  var totalHouseholdsRenting = 0
  var totalRentingThirty349 = 0
  var totalRentingThirtyFive399 = 0
  var totalRentingForty499 = 0
  var totalRentingFiftyPlus = 0
  var totalRentingNotComputed = 0

  // Mortgage
  var totalHouseholdsMortgage = 0
  var totalMortgageThirty349 = 0
  var totalMortgageThirtyFive399 = 0
  var totalMortgageForty499 = 0
  var totalMortgageFiftyPlus = 0
  var totalMortgageNotComputed = 0
  var totalNoMortgageThirty349 = 0
  var totalNoMortgageThirtyFive399 = 0
  var totalNoMortgageForty499 = 0
  var totalNoMortgageFiftyPlus = 0
  var totalNoMortgageNotComputed = 0


  filteredArray.map((k) => {

    totalHouseholdsBelowPoverty += parseInt(k[0])
    totalIncomeBelowPoverty += parseInt(k[1])

    totalHouseholdsUnder18 += parseInt(k[2])
    totalOneOrMore18 += parseInt(k[3])

    totalHouseholdsRenting += parseInt(k[4])
    totalRentingThirty349 += parseInt(k[5])
    totalRentingThirtyFive399 += parseInt(k[6])
    totalRentingForty499 += parseInt(k[7])
    totalRentingFiftyPlus += parseInt(k[8])
    totalRentingNotComputed += parseInt(k[9])

    totalHouseholdsMortgage += parseInt(k[10])
    totalMortgageThirty349 += parseInt(k[11])
    totalMortgageThirtyFive399 += parseInt(k[12])
    totalMortgageForty499 += parseInt(k[13])
    totalMortgageFiftyPlus += parseInt(k[14])
    totalMortgageNotComputed += parseInt(k[15])
    totalNoMortgageThirty349 += parseInt(k[16])
    totalNoMortgageThirtyFive399 += parseInt(k[17])
    totalNoMortgageForty499 += parseInt(k[18])
    totalNoMortgageFiftyPlus += parseInt(k[19])
    totalNoMortgageNotComputed += parseInt(k[20])
  })

  var HHBelowPovertyLine = totalIncomeBelowPoverty / totalHouseholdsBelowPoverty
  var HHWithChildren = totalOneOrMore18 / totalHouseholdsUnder18

  var totalRentingOwnedHosueholds = totalHouseholdsRenting + totalHouseholdsMortgage
  var totalNotComputed = totalRentingNotComputed + totalMortgageNotComputed + totalNoMortgageNotComputed
  var totalHHSpending = totalRentingThirty349 + totalRentingThirtyFive399 + totalRentingForty499 + totalRentingFiftyPlus + totalMortgageThirty349 + totalMortgageThirtyFive399 + totalMortgageForty499 + totalMortgageFiftyPlus + totalNoMortgageThirty349 + totalNoMortgageThirtyFive399 + totalNoMortgageForty499 + totalNoMortgageFiftyPlus

  var HHSpendingGreater30 = totalHHSpending / (totalRentingOwnedHosueholds - totalNotComputed)

  var censusAffordabilityData = {

    HHBelowPovertyLine: HHBelowPovertyLine,
    HHWithChildren: HHWithChildren,
    HHSpendingGreater30: HHSpendingGreater30
  }

  res.send(censusAffordabilityData);
});

// Creates a new data object, 'censusRentData', holding Census rental totals data. This is added to 'globalCenusData'.
// Locally, this POST request must be run following running '/api/cacheCensusRent' to store the cached data in 'globalCensusRent'.
// On 'api-app-05', this can only be executed following the execution of '/api/cacheCensusRent', which happens every 30 days.
// POST: {"idArray": ["0131001","0129001"]} <-- {"idArray": ["TRACT+BLKGRP","TRACT+BLKGRP"]} | EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getCensusHomePriceMedian
app.post('/api/getCensusRentMedian', function (req, res) {

  var filteredArray = globalCensusRent.filter((el) => {

    return req.body.includes(el[26] + el[27])
  })

  // Init rental data totals
  var totalRentLess100 = 0
  var totalRentHundred149 = 0
  var totalRentHundredFifty199 = 0
  var totalRentTwoHundred249 = 0
  var totalRentTwoFifty299 = 0
  var totalRentThreeHundred349 = 0
  var totalRentThreeFifty399 = 0
  var totalRentFourHundred449 = 0
  var totalRentFourFifty499 = 0
  var totalRentFiveHundred549 = 0
  var totalRentFiveFifty599 = 0
  var totalRentSixHundred649 = 0
  var totalRentSixFifty699 = 0
  var totalRentSevenHundred749 = 0
  var totalRentSevenFifty799 = 0
  var totalRentEightHundred899 = 0
  var totalRentNineHundred999 = 0
  var totalRentThousand1249 = 0
  var totalRentTwelveFifty1499 = 0
  var totalRentFifteenHundred1999 = 0
  var totalRentTwoThousand2499 = 0
  var totalRentTwentyFiveHundred2999 = 0
  var totalRentThreeThousand3499 = 0
  var totalRentThirtyFiveHundredPlus = 0

  filteredArray.map((k) => {

    totalRentLess100 += parseInt(k[0])
    totalRentHundred149 += parseInt(k[1])
    totalRentHundredFifty199 += parseInt(k[2])
    totalRentTwoHundred249 += parseInt(k[3])
    totalRentTwoFifty299 += parseInt(k[4])
    totalRentThreeHundred349 += parseInt(k[5])
    totalRentThreeFifty399 += parseInt(k[6])
    totalRentFourHundred449 += parseInt(k[7])
    totalRentFourFifty499 += parseInt(k[8])
    totalRentFiveHundred549 += parseInt(k[9])
    totalRentFiveFifty599 += parseInt(k[10])
    totalRentSixHundred649 += parseInt(k[11])
    totalRentSixFifty699 += parseInt(k[12])
    totalRentSevenHundred749 += parseInt(k[13])
    totalRentSevenFifty799 += parseInt(k[14])
    totalRentEightHundred899 += parseInt(k[15])
    totalRentNineHundred999 += parseInt(k[16])
    totalRentThousand1249 += parseInt(k[17])
    totalRentTwelveFifty1499 += parseInt(k[18])
    totalRentFifteenHundred1999 += parseInt(k[19])
    totalRentTwoThousand2499 += parseInt(k[20])
    totalRentTwentyFiveHundred2999 += parseInt(k[21])
    totalRentThreeThousand3499 += parseInt(k[22])
    totalRentThirtyFiveHundredPlus += parseInt(k[23])
  })

  var totalRent = totalRentLess100 + totalRentHundred149 + totalRentHundredFifty199 + totalRentTwoHundred249 + totalRentTwoFifty299 + totalRentThreeHundred349 + totalRentThreeFifty399 + totalRentFourHundred449 + totalRentFourFifty499 + totalRentFiveHundred549 + totalRentFiveFifty599 + totalRentSixHundred649 + totalRentSixFifty699 + totalRentSevenHundred749 + totalRentSevenFifty799 + totalRentEightHundred899 + totalRentNineHundred999 + totalRentThousand1249 + totalRentTwelveFifty1499 + totalRentFifteenHundred1999 + totalRentTwoThousand2499 + totalRentTwentyFiveHundred2999 + totalRentThreeThousand3499 + totalRentThirtyFiveHundredPlus
  var totalsArr = [
    totalRent,
    totalRentLess100,
    totalRentHundred149,
    totalRentHundredFifty199,
    totalRentTwoHundred249,
    totalRentTwoFifty299,
    totalRentThreeHundred349,
    totalRentThreeFifty399,
    totalRentFourHundred449,
    totalRentFourFifty499,
    totalRentFiveHundred549,
    totalRentFiveFifty599,
    totalRentSixHundred649,
    totalRentSixFifty699,
    totalRentSevenHundred749,
    totalRentSevenFifty799,
    totalRentEightHundred899,
    totalRentNineHundred999,
    totalRentThousand1249,
    totalRentTwelveFifty1499,
    totalRentFifteenHundred1999,
    totalRentTwoThousand2499,
    totalRentTwentyFiveHundred2999,
    totalRentThreeThousand3499,
    totalRentThirtyFiveHundredPlus
  ]

  var paretoMedian = calc_MedianRent(totalsArr)

  var censusRentData = {

    paretoMedian: paretoMedian
  }

  res.send(censusRentData);
});

// Creates a new data object, 'censusHomePriceData', holding Census Housing Occupancy totals data. This is added to 'globalCenusData'.
// Locally, this POST request must be run following running '/api/cacheCensusHomePrice' to store the cached data in 'globalCensusHomePrice'.
// On 'api-app-05', this can only be executed following the execution of '/api/cacheCensusHomePrice', which happens every 30 days.
// POST: {"idArray": ["0131001","0129001"]} <-- {"idArray": ["TRACT+BLKGRP","TRACT+BLKGRP"]} | EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getCensusHomePriceMedian
app.post('/api/getCensusHomePriceMedian', function (req, res) {

  var filteredArray = globalCensusHomePrice.filter((el) => {

    return req.body.includes(el[28] + el[29])
  })

  // Home Price
  var totalHomeLess10k = 0
  var totalHomeTen14 = 0
  var totalHomeFif19 = 0
  var totalHomeTwenty24 = 0
  var totalHomeTwentyFive29 = 0
  var totalHomeThirty34 = 0
  var totalHomeThirtyFive39 = 0
  var totalHomeFourty49 = 0
  var totalHomeFifty59 = 0
  var totalHomeSixty69 = 0
  var totalHomeSeventy79 = 0
  var totalHomeEighty89 = 0
  var totalHomeNinety99 = 0
  var totalHomeHundred124 = 0
  var totalHomeHundredTwentyFive149 = 0
  var totalHomeHundredFifty175 = 0
  var totalHomeHundredSeventyFive200 = 0
  var totalHomeTwoHundred250 = 0
  var totalHomeTwoFifty299 = 0
  var totalHomeThreeHundred399 = 0
  var totalHomeFourHundred499 = 0
  var totalHomeFiveHundred749 = 0
  var totalHomeSevenFifty999 = 0
  var totalHomeMil14 = 0
  var totalHomeMilHalf19 = 0
  var totalHomeTwoMil = 0

  filteredArray.map((k) => {

    totalHomeLess10k += parseInt(k[0])
    totalHomeTen14 += parseInt(k[1]) // Append/fill census attributes by column index
    totalHomeFif19 += parseInt(k[2])
    totalHomeTwenty24 += parseInt(k[3])
    totalHomeTwentyFive29 += parseInt(k[4])
    totalHomeThirty34 += parseInt(k[5])
    totalHomeThirtyFive39 += parseInt(k[6])
    totalHomeFourty49 += parseInt(k[7])
    totalHomeFifty59 += parseInt(k[8])
    totalHomeSixty69 += parseInt(k[9])
    totalHomeSeventy79 += parseInt(k[10])
    totalHomeEighty89 += parseInt(k[11])
    totalHomeNinety99 += parseInt(k[12])
    totalHomeHundred124 += parseInt(k[13])
    totalHomeHundredTwentyFive149 += parseInt(k[14])
    totalHomeHundredFifty175 += parseInt(k[15])
    totalHomeHundredSeventyFive200 += parseInt(k[16])
    totalHomeTwoHundred250 += parseInt(k[17])
    totalHomeTwoFifty299 += parseInt(k[18])
    totalHomeThreeHundred399 += parseInt(k[19])
    totalHomeFourHundred499 += parseInt(k[20])
    totalHomeFiveHundred749 += parseInt(k[21])
    totalHomeSevenFifty999 += parseInt(k[22])
    totalHomeMil14 += parseInt(k[23])
    totalHomeMilHalf19 += parseInt(k[24])
    totalHomeTwoMil += parseInt(k[25])
  })

  var totalHomePrice = totalHomeLess10k + totalHomeTen14 + totalHomeFif19 + totalHomeTwenty24 + totalHomeTwentyFive29 + totalHomeThirty34 + totalHomeThirtyFive39 + totalHomeFourty49 + totalHomeFifty59 + totalHomeSixty69 + totalHomeSeventy79 + totalHomeEighty89 + totalHomeNinety99 + totalHomeHundred124 + totalHomeHundredTwentyFive149 + totalHomeHundredFifty175 + totalHomeHundredSeventyFive200 + totalHomeTwoHundred250 + totalHomeTwoFifty299 + totalHomeThreeHundred399 + totalHomeFourHundred499 + totalHomeFiveHundred749 + totalHomeSevenFifty999 + totalHomeMil14 + totalHomeMilHalf19 + totalHomeTwoMil
  var totalsArr = [
    totalHomePrice,
    totalHomeLess10k,
    totalHomeTen14,
    totalHomeFif19,
    totalHomeTwenty24,
    totalHomeTwentyFive29,
    totalHomeThirty34,
    totalHomeThirtyFive39,
    totalHomeFourty49,
    totalHomeFifty59,
    totalHomeSixty69,
    totalHomeSeventy79,
    totalHomeEighty89,
    totalHomeNinety99,
    totalHomeHundred124,
    totalHomeHundredTwentyFive149,
    totalHomeHundredFifty175,
    totalHomeHundredSeventyFive200,
    totalHomeTwoHundred250,
    totalHomeTwoFifty299,
    totalHomeThreeHundred399,
    totalHomeFourHundred499,
    totalHomeFiveHundred749,
    totalHomeSevenFifty999,
    totalHomeMil14,
    totalHomeMilHalf19,
    totalHomeTwoMil
  ]

  var paretoMedian = calc_MedianHomePrice(totalsArr)

  var censusHomePriceData = {

    paretoMedian: paretoMedian
  }

  res.send(censusHomePriceData);
});

// Creates a new data object, 'censusHousingOccupancyData', holding Census Housing Occupancy totals data. This is added to 'globalCenusData'.
// Locally, this POST request must be run following running '/api/getCensusHousingOccTotals' to store the cached data in 'globalCensusHousingOcc'.
// On 'api-app-05', this can only be executed following the execution of '/api/cacheCensusHousingOcc', which happens every 30 days.
// POST: {"idArray": ["0131001","0129001"]} <-- {"idArray": ["TRACT+BLKGRP","TRACT+BLKGRP"]} | EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getCensusHousingOccTotals
app.post('/api/getCensusHousingOccTotals', function (req, res) {

  var filteredArray = globalCensusHousingOcc.filter((el) => {

    return req.body.includes(el[13] + el[14])
  })

  var totalHousing = 0 // US Census column ABC###
  var totalSeasonal = 0
  var totalOwnOccp = 0
  var totalRntOccp = 0
  var totalForRent = 0
  var totalRntNotOcc = 0
  var totalForSale = 0
  var totalSoldNotOcc = 0
  var totalSeaRecOcc = 0
  var totalMigrant = 0
  var totalOtherVac = 0

  filteredArray.map((k) => {

    totalHousing += parseInt(k[0])
    totalSeasonal += parseInt(k[1]) // Append/fill census attributes by column index
    totalOwnOccp += parseInt(k[2])
    totalRntOccp += parseInt(k[3])
    totalForRent += parseInt(k[4])
    totalRntNotOcc += parseInt(k[5])
    totalForSale += parseInt(k[6])
    totalSoldNotOcc += parseInt(k[7])
    totalSeaRecOcc += parseInt(k[8])
    totalMigrant += parseInt(k[9])
    totalOtherVac += parseInt(k[10])
  })

  var totalYearRound = totalHousing - totalSeasonal
  var totalOwned = totalOwnOccp + totalForSale + totalSoldNotOcc + totalSeaRecOcc + totalMigrant + totalOtherVac
  var totalRental = totalRntOccp + totalForRent + totalRntNotOcc

  var censusHousingOccupancyData = {

    totalYearRound: totalYearRound,
    totalHousing: totalHousing,
    totalSeasonal: totalSeasonal,
    totalOwned: totalOwned,
    totalRental: totalRental
  }

  res.send(censusHousingOccupancyData);
});

// Creates a new data object, 'censusIncomeEmploymentEducation', holding Census Income, Employment & Education totals data. This is added to 'globalCenusData'.
// Locally, this POST request must be run following running '/api/cacheCensusIncomeEmploymentEducation' to store the cached data in 'globalCensusIncomeEmploymentEducation'.
// On 'api-app-05', this can only be executed following the execution of '/api/cacheCensusIncomeEmploymentEducation', which happens every 30 days.
// POST: {"idArray": ["0131001","0129001"]} <-- {"idArray": ["TRACT+BLKGRP","TRACT+BLKGRP"]} | EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getCensusHousingOccTotals
app.post('/api/getCensusIncomeEmploymentEducationTotals', function (req, res) {

  var filteredArray = globalCensusIncomeEmploymentEducation.filter((el) => {

    return req.body.includes(el[52] + el[53])
  })

  // Income
  var totalLess10k = 0;  // US Census column ABC###
  var totalTen14 = 0;
  var totalFif19 = 0;
  var totalTwenty24 = 0;
  var totalTwentyFive29 = 0;
  var totalThirty34 = 0;
  var totalThirtyFive39 = 0;
  var totalFourty44 = 0;
  var totalFourtyFive49 = 0;
  var totalFifty59 = 0;
  var totalSixty74 = 0;
   var totalSeventyFive99 = 0;
  var totalHundred124 = 0;
  var totalHundredTwentyFive149 = 0;
  var totalHundredFifty199 = 0;
  var totalTwoHundredPlus = 0;

  // Employment
  var totalCivilLabor = 0;
  var totalUnemp = 0;

  // Education
  var totalEdu = 0;
  var totalNoSchool = 0;
  var totalNursery = 0;
  var totalKindergarten = 0;
  var totalG1 = 0;
  var totalG2 = 0;
  var totalG3 = 0;
  var totalG4 = 0;
  var totalG5 = 0;
  var totalG6 = 0;
  var totalG7 = 0;
  var totalG8 = 0;
  var totalG9 = 0;
  var totalG10 = 0;
  var totalG11 = 0;
  var totalG12 = 0;
  var totalHS = 0;
  var totalGED = 0;
  var totalSCLess1 = 0;
  var totalSCMore1 = 0;
  var totalAss = 0;
  var totalBac = 0;
  var totalMas = 0;
  var totalPro = 0;
  var totalDoc = 0;

  filteredArray.map((k) => {

    // Income
    totalLess10k += parseInt(k[2])
    totalTen14 += parseInt(k[3])
    totalFif19 += parseInt(k[4])
    totalTwenty24 += parseInt(k[5])
    totalTwentyFive29 += parseInt(k[6])
    totalThirty34 += parseInt(k[7])
    totalThirtyFive39 += parseInt(k[8])
    totalFourty44 += parseInt(k[9])
    totalFourtyFive49 += parseInt(k[10])
    totalFifty59 += parseInt(k[11])
    totalSixty74 += parseInt(k[12])
    totalSeventyFive99 += parseInt(k[13])
    totalHundred124 += parseInt(k[14])
    totalHundredTwentyFive149 += parseInt(k[15])
    totalHundredFifty199 += parseInt(k[16])
    totalTwoHundredPlus += parseInt(k[17])

    // Employment
    totalCivilLabor += parseInt(k[18])
    totalUnemp += parseInt(k[19])

    // Education
    totalEdu += parseInt(k[20])
    totalNoSchool += parseInt(k[21])
    totalNursery += parseInt(k[22])
    totalKindergarten += parseInt(k[23])
    totalG1 += parseInt(k[24])
    totalG2 += parseInt(k[25])
    totalG3 += parseInt(k[26])
    totalG4 += parseInt(k[27])
    totalG5 += parseInt(k[28])
    totalG6 += parseInt(k[29])
    totalG7 += parseInt(k[30])
    totalG8 += parseInt(k[31])
    totalG9 += parseInt(k[32])
    totalG10 += parseInt(k[33])
    totalG11 += parseInt(k[34])
    totalG12 += parseInt(k[35])
    totalHS += parseInt(k[36])
    totalGED += parseInt(k[37])
    totalSCLess1 += parseInt(k[38])
    totalSCMore1 += parseInt(k[39])
    totalAss += parseInt(k[40])
    totalBac += parseInt(k[41])
    totalMas += parseInt(k[42])
    totalPro += parseInt(k[43])
    totalDoc += parseInt(k[44])
  })

  var totalHSG = totalHS + totalGED
  var totalSCA = totalSCLess1 + totalSCMore1 + totalAss
  var totalGradPro = totalMas + totalPro + totalDoc
  var totalLessHS = totalNoSchool + totalNursery + totalKindergarten + totalG1 + totalG2 + totalG3 + totalG4 + totalG5 + totalG6 + totalG7 + totalG8 + totalG9 + totalG10 + totalG11 + totalG12
  totalBac = totalBac

  var percUnemp = totalUnemp / totalCivilLabor

  percUnemp = parseFloat(percUnemp).toFixed(3)

  var totalHousehold = totalLess10k + totalTen14 + totalFif19 + totalTwenty24 + totalTwentyFive29 + totalThirty34 + totalThirtyFive39 + totalFourty44 + totalFourtyFive49 + totalFifty59 + totalSixty74 + totalSeventyFive99 + totalHundred124 + totalHundredTwentyFive149 + totalHundredFifty199 + totalTwoHundredPlus

  var totalsArr = [
    totalHousehold,
    totalLess10k,
    totalTen14,
    totalFif19,
    totalTwenty24,
    totalTwentyFive29,
    totalThirty34,
    totalThirtyFive39,
    totalFourty44,
    totalFourtyFive49,
    totalFifty59,
    totalSixty74,
    totalSeventyFive99,
    totalHundred124,
    totalHundredTwentyFive149,
    totalHundredFifty199,
    totalTwoHundredPlus
  ]

  var paretoMedian = calc_MedianIncome(totalsArr)

  var censusIncomeEmploymentEducation = {

    percUnemp: percUnemp,
    lessHS: totalLessHS,
    hsg: totalHSG,
    sca: totalSCA,
    bac: totalBac,
    gradPro: totalGradPro,
    totalEdu: totalEdu,
    paretoMedian: paretoMedian
  }

  res.send(censusIncomeEmploymentEducation)
});



// Creates a new data object, 'censusEduTractData', holding Census Education data. This is added to 'globalCenusData'.
// Locally, this POST request must be run following running '/api/cacheCensusEduTract' to store the cached data in 'globalCensusEduTract'.
// On 'api-app-05', this can only be executed following the execution of '/api/cacheCensusEduTract', which happens every 30 days.
// POST: {"idArray": ["013100","012900"]} <-- {"idArray": ["TRACT","TRACT"]} | EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getCensusEduTractTotals
app.post('/api/getCensusEduTractTotals', function (req, res) {

  var filteredArray = globalCensusEduTract.filter((el) => {

    return req.body.includes(el[7])
  })

  var totalLessHSG = 0
  var totalHSG = 0
  var totalSCA = 0
  var totalBac = 0
  var totalGrad = 0
  var totalIncLength = 0

  filteredArray.map((k) => {

    totalIncLength++

    // Replace negative values with 1
    if (parseInt(k[0]) < 0) {

      totalLessHSG += 1
    } else {

      totalLessHSG += parseInt(k[0])
    }

    if (parseInt(k[1]) < 0) {

      totalHSG += 1
    } else {

      totalHSG += parseInt(k[1])
    }

    if (parseInt(k[2]) < 0) {

      totalSCA += 1
    } else {

      totalSCA += parseInt(k[2])
    }

    if (parseInt(k[3]) < 0) {

      totalBac += 1
    } else {

      totalBac += parseInt(k[3])
    }

    if (parseInt(k[4]) < 0) {

      totalGrad += 1
    } else {

      totalGrad += parseInt(k[4])
    }
  })

  totalLessHSG = totalLessHSG / totalIncLength
  totalHSG = totalHSG / totalIncLength
  totalSCA = totalSCA / totalIncLength
  totalBac = totalBac / totalIncLength
  totalGrad = totalGrad / totalIncLength

  var censusEduTractData = {

    totalLessHSG: totalLessHSG,
    totalHSG: totalHSG,
    totalSCA: totalSCA,
    totalBac: totalBac,
    totalGrad: totalGrad
  }

  res.send(censusEduTractData);
});

// Creates a new data object, 'censusEduTownData', holding Census Education data. This is added to 'globalCenusData'.
// Locally, this POST request must be run following running '/api/cacheCensusEduTown' to store the cached data in 'globalCensusEduTown'.
// On 'api-app-05', this can only be executed following the execution of '/api/cacheCensusEduTown', which happens every 30 days.
// POST: {"idArray": ["BARNSTABLE","HYANNIS"} <-- {"idArray": ["TOWNNAME","TOWNNAME"]} | EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getCensusEduTownTotals
app.post('/api/getCensusEduTownTotals', function (req, res) {

  var filteredArray = globalCensusEduTown.filter((el) => {

    return req.body.includes(el[0])
  })

  var totalLessHSG = 0
  var totalHSG = 0
  var totalSCA = 0
  var totalBac = 0
  var totalGrad = 0
  var totalIncLength = 0

  filteredArray.map((k) => {

    totalIncLength++

    // Replace negative values with 1
    if (parseInt(k[1]) < 0) {

      totalLessHSG += 1
    } else {

      totalLessHSG += parseInt(k[1])
    }

    if (parseInt(k[2]) < 0) {

      totalHSG += 1
    } else {

      totalHSG += parseInt(k[2])
    }

    if (parseInt(k[3]) < 0) {

      totalSCA += 1
    } else {

      totalSCA += parseInt(k[3])
    }

    if (parseInt(k[4]) < 0) {

      totalBac += 1
    } else {

      totalBac += parseInt(k[4])
    }

    if (parseInt(k[5]) < 0) {

      totalGrad += 1
    } else {

      totalGrad += parseInt(k[5])
    }
  })

  totalLessHSG = totalLessHSG / totalIncLength
  totalHSG = totalHSG / totalIncLength
  totalSCA = totalSCA / totalIncLength
  totalBac = totalBac / totalIncLength
  totalGrad = totalGrad / totalIncLength

  var censusEduTownData = {

    totalLessHSG: totalLessHSG,
    totalHSG: totalHSG,
    totalSCA: totalSCA,
    totalBac: totalBac,
    totalGrad: totalGrad
  }

  res.send(censusEduTownData);
});

// Creates a new data object, 'censusAgeData', holding Census age totals data. This is added to 'globalCenusData'.
// Locally, this POST request must be run following running '/api/cacheCensusAge' to store the cached data in 'globalCensusAge'.
// On 'api-app-05', this can only be executed following the execution of '/api/cacheCensusAge', which happens every 30 days.
// POST: {"idArray": ["0131001","0129001"]} <-- {"idArray": ["TRACT+BLKGRP","TRACT+BLKGRP"]} | EXAMPLE: http://sql-connect.api.capecodcommission.org/api/getCensusAgeTotals
app.post('/api/getCensusAgeTotals', function (req, res) {

  var filteredArray = globalCensusAge.filter((el) => {

    return req.body.includes(el[48] + el[49])
  })

  // Ages 0 - 19
  var totalMaleUnder5 = 0
  var totalMaleFive9 = 0
  var totalMaleTen14 = 0
  var totalMaleFifteen17 = 0
  var totalMaleEighteen19 = 0
  var totalFemaleUnder5 = 0
  var totalFemaleFive9 = 0
  var totalFemaleTen14 = 0
  var totalFemaleFifteen17 = 0
  var totalFemaleEighteen19 = 0

  // Ages 20 - 44
  var totalMaleTwenty = 0
  var totalMaleTwentyOne = 0
  var totalMaleTwentyTwo24 = 0
  var totalMaleTwentyFive29 = 0
  var totalMaleThirty34 = 0
  var totalMaleThirtyFive39 = 0
  var totalMaleForty44 = 0
  var totalFemaleTwenty = 0
  var totalFemaleTwentyOne = 0
  var totalFemaleTwentyTwo24 = 0
  var totalFemaleTwentyFive29 = 0
  var totalFemaleThirty34 = 0
  var totalFemaleThirtyFive39 = 0
  var totalFemaleForty44 = 0

  // Ages 45 - 64
  var totalMaleFortyFive49 = 0
  var totalMaleFifty54 = 0
  var totalMaleFiftyFive59 = 0
  var totalMaleSixty61 = 0
  var totalMaleSixtyTwo64 = 0
  var totalFemaleFortyFive49 = 0
  var totalFemaleFifty54 = 0
  var totalFemaleFiftyFive59 = 0
  var totalFemaleSixty61 = 0
  var totalFemaleSixtyTwo64 = 0

  // Ages 65+
  var totalMaleSixtyFive66 = 0
  var totalMaleSixtySeven69 = 0
  var totalMaleSeventy74 = 0
  var totalMaleSeventyFive79 = 0
  var totalMaleEighty84 = 0
  var totalMaleEightyFivePlus = 0
  var totalFemaleSixtyFive66 = 0
  var totalFemaleSixtySeven69 = 0
  var totalFemaleSeventy74 = 0
  var totalFemaleSeventyFive79 = 0
  var totalFemaleEighty84 = 0
  var totalFemaleEightyFivePlus = 0

  filteredArray.map((k) => {

    totalMaleUnder5 += parseInt(k[0])
    totalMaleFive9 += parseInt(k[1])
    totalMaleTen14 += parseInt(k[2])
    totalMaleFifteen17 += parseInt(k[3])
    totalMaleEighteen19 += parseInt(k[4])
    totalFemaleUnder5 += parseInt(k[5])
    totalFemaleFive9 += parseInt(k[6])
    totalFemaleTen14 += parseInt(k[7])
    totalFemaleFifteen17 += parseInt(k[8])
    totalFemaleEighteen19 += parseInt(k[9])

    totalMaleTwenty += parseInt(k[10])
    totalMaleTwentyOne += parseInt(k[11])
    totalMaleTwentyTwo24 += parseInt(k[12])
    totalMaleTwentyFive29 += parseInt(k[13])
    totalMaleThirty34 += parseInt(k[14])
    totalMaleThirtyFive39 += parseInt(k[15])
    totalMaleForty44 += parseInt(k[16])
    totalFemaleTwenty += parseInt(k[17])
    totalFemaleTwentyOne += parseInt(k[18])
    totalFemaleTwentyTwo24 += parseInt(k[19])
    totalFemaleTwentyFive29 += parseInt(k[20])
    totalFemaleThirty34 += parseInt(k[21])
    totalFemaleThirtyFive39 += parseInt(k[22])
    totalFemaleForty44 += parseInt(k[23])

    totalMaleFortyFive49 += parseInt(k[24])
    totalMaleFifty54 += parseInt(k[25])
    totalMaleFiftyFive59 += parseInt(k[26])
    totalMaleSixty61 += parseInt(k[27])
    totalMaleSixtyTwo64 += parseInt(k[28])
    totalFemaleFortyFive49 += parseInt(k[29])
    totalFemaleFifty54 += parseInt(k[30])
    totalFemaleFiftyFive59 += parseInt(k[31])
    totalFemaleSixty61 += parseInt(k[32])
    totalFemaleSixtyTwo64 += parseInt(k[33])

    totalMaleSixtyFive66 += parseInt(k[34])
    totalMaleSixtySeven69 += parseInt(k[35])
    totalMaleSeventy74 += parseInt(k[36])
    totalMaleSeventyFive79 += parseInt(k[37])
    totalMaleEighty84 += parseInt(k[38])
    totalMaleEightyFivePlus += parseInt(k[39])
    totalFemaleSixtyFive66 += parseInt(k[40])
    totalFemaleSixtySeven69 += parseInt(k[41])
    totalFemaleSeventy74 += parseInt(k[42])
    totalFemaleSeventyFive79 += parseInt(k[43])
    totalFemaleEighty84 += parseInt(k[44])
    totalFemaleEightyFivePlus += parseInt(k[45])
  })

  var agesZero19 = totalMaleUnder5 + totalMaleFive9 + totalMaleTen14 + totalMaleFifteen17 + totalMaleEighteen19 + totalFemaleUnder5 + totalFemaleFive9 + totalFemaleTen14 + totalFemaleFifteen17 + totalFemaleEighteen19
  var agesTwenty44 = totalMaleTwenty + totalMaleTwentyOne + totalMaleTwentyTwo24 + totalMaleTwentyFive29 + totalMaleThirty34 + totalMaleThirtyFive39 + totalMaleForty44 + totalFemaleTwenty + totalFemaleTwentyOne + totalFemaleTwentyTwo24 + totalFemaleTwentyFive29 + totalFemaleThirty34 + totalFemaleThirtyFive39 + totalFemaleForty44
  var agesFortyFive64 = totalMaleFortyFive49 + totalMaleFifty54 + totalMaleFiftyFive59 + totalMaleSixty61 + totalMaleSixtyTwo64 + totalFemaleFortyFive49 + totalFemaleFifty54 + totalFemaleFiftyFive59 + totalFemaleSixty61 + totalFemaleSixtyTwo64
  var agesSixtyFivePlus = totalMaleSixtyFive66 + totalMaleSixtySeven69 + totalMaleSeventy74 + totalMaleSeventyFive79 + totalMaleEighty84 + totalMaleEightyFivePlus + totalFemaleSixtyFive66 + totalFemaleSixtySeven69 + totalFemaleSeventy74 + totalFemaleSeventyFive79 + totalFemaleEighty84 + totalFemaleEightyFivePlus

  var censusAgeData = {

    agesZero19: agesZero19,
    agesTwenty44: agesTwenty44,
    agesFortyFive64: agesFortyFive64,
    agesSixtyFivePlus: agesSixtyFivePlus
  }

  res.send(censusAgeData);
});


//******************************---SAM API---******************************

// SAM API progress in this context has been discontinued, and will continue within GraphQL


// GET ScenarioWiz data from 'wMVP3_CapeCodMA' DB where scenario id = ##
// EXAMPLE: SCENARIO ID 2727 | http://sql-connect.api.capecodcommission.org/api/ScenarioWiz/2727
// app.get('/api/getScenarioWizData/:id', function(req , res) {

//   getScenarioWizData(req.params.id).then((scenarioResponse) => {

//     // AreaID in ScenarioWiz seems to be the EMBAY_ID in FTCoeff
//     // Although, in SAMMonica.php, the FTCoeff query is filtering on SUBEM_ID instead of EMBAY_ID
//       var subemKey = scenarioResponse.recordset[0].AreaID

//       getFTCoeffData(subemKey).then((ftResponse) => {

//         console.log(ftResponse.recordset)
//       })
//     })
// });

// // GET row from scenario wiz table by scenario id, pass request but not response
// var getScenarioWizData = function(id) {

//   var scenarioWizRequest = new sql.Request(wmvp3Connect)
//   var scenarioWizQuery = 'select * from CapeCodMA.Scenario_Wiz where ScenarioID = ' + id

//   return scenarioWizRequest.query(scenarioWizQuery)
// }

// // GET rows from ftcoeff table by subembaymentid, pass request but not response
// var getFTCoeffData = function(id) {

//   var ftCoeffRequest = new sql.Request(wmvp3Connect)
//   var ftCoeffQuery = "select SUBWATER_ID from CapeCodMA.FTCoeff where EMBAY_ID = " + id

//   return ftCoeffRequest.query(ftCoeffQuery)
// }
