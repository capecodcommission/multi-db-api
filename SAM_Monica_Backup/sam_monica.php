<? header('Access-Control-Allow-Origin: *');

// this is a copy of sue_win.php modified by chase for his understanding.

include('../dbCG.php');

if(isset($_GET['id'])){	
	$id = $_GET['id'];
} else {	
	$id = $_POST['id'];	
}

// get area, key, and scenario parcels
$scenario_q = 'select * from [WMVP_Wizard].[CapeCodMA].[Scenario_Wiz] where ScenarioID = ' . $id;
$scenario_r = mssql_query($scenario_q);
while ($srow = mssql_fetch_object($scenario_r)) {
	
	$area = $srow->AreaType;
	$key = $srow->AreaID;
	$location = $srow->AreaName;
	$totalN = $srow->Nload_Existing;
	$septicN = $srow->Nload_Sept;
	$fertN = $srow->Nload_Fert;
	$stormN = $srow->Nload_Storm;
	$totalNcalc = $srow->Nload_Calculated_Total;
	$totalTarget = $srow->Nload_Total_Target;
	$septicTarget = $srow->Nload_Sept_Target;
	$fertNcalc = $srow->Nload_Calculated_Fert;
	$swNcalc = $srow->Nload_Calculated_SW;
	$septicNcalc = $srow->Nload_Calculated_Septic;
	$gwNcalc = $srow->Nload_Calculated_GW;
	$embayNcalc = $srow->Nload_Calculated_InEmbay;
	$attNcalc = $srow->Nload_Calculated_Attenuation;
	$fertNreduc = $srow->Nload_Reduction_Fert;
	$swNreduc = $srow->Nload_Reduction_SW;
	$septicNreduc = $srow->Nload_Reduction_Septic;
	$gwNreduc = $srow->Nload_Reduction_GW;
	$attNreduc = $srow->Nload_Reduction_Attenuation;
	$embayNreduc = $srow->Nload_Reduction_InEmbay;
	$totalNreduc = $fertNreduc+$swNreduc+$septicNreduc+$gwNreduc+$attNreduc+$embayNreduc;
	$parAll = $srow->Total_Parcels;
	$scenarioAcreage = $srow->ScenarioAcreage;
	
	//get subwatersheds
	$subw_q = "select SUBWATER_ID from WMVP_Wizard.CapeCodMA.FTCoeff where SUBEM_ID = " . $key;
	$subw_r = mssql_query($subw_q);
	$subwatersheds = "(";
	while ($subw_row = mssql_fetch_object($subw_r)){
		$subwatersheds .= $subw_row->SUBWATER_ID . ",";
	}
	$subwatersheds = rtrim($subwatersheds,",");
	$subwatersheds .= ")";
	
	$parWFcount=0;
	$parFZcount=0;
	$total_prop_value=0;
	$seWUall = 0;
	$seWU = 0;
	$waterfront_prop_value=0;
	$septPar = 0;
	//get parcels
	$shape_q = "select * from [TBL_Dev].[dbo].[WIN] where SUBWATER_ID IN " . $subwatersheds;
	$shape_r = mssql_query($shape_q);
	while ($shape_row = mssql_fetch_object($shape_r)){
		//sum assessed value for shed
		$total_prop_value += $shape_row->TotalAssessedValue;
		$seWUall += $shape_row->WaterUseExisting;
		//count waterfront parcels in shed
		if ($shape_row->Waterfront == 1){
			$waterfront_prop_value += $shape_row->TotalAssessedValue;
			$parWFcount++;
		};
		//count FZ parcels in shed
		if ($shape_row->NewSLIRM == 1){
			$parFZcount++;
		};
		//count parcels on septic
		if ($shape_row->WWTreatmentExisting == "SEPTIC"){
			$septPar ++;
			$seWU += $shape_row->WaterUseExisting;
		};
		//get Nload conversion key
		$nconv_key = $shape_row->Embayment;
		if ($nconv_key == 'Three Bay'){
			$nconv_key = 'Three Bays';
		};
	};
	//get Nload conversion formula
	$mep_conversion_q = "SELECT [Intercept] ,[Slope]  FROM [TBL_Dev].[dbo].[TBL_NConversion_SQL] where EMBAY_DISP = '" . $nconv_key . "'";	
	$mep_conversion_r = mssql_query($mep_conversion_q);
	while($mep = mssql_fetch_object($mep_conversion_r)){	
		$slope = $mep->Slope;
		$intercept = $mep->Intercept;
	};
	
	
	$newCap = 0;
	$newOM = 0;
	$newVarC = 0;
	$newGC = 0;
	$newJobs = 0;
	$oldJobs = 0;
	$newVarP = 0;
	$newYears = 0;
	$floodSum = 0;
	//PVLA,floodresil
	$tCount = 0;
	
	//get treatments
	$treat_q = "Select * from WMVP_Wizard.CapeCodMA.Treatment_Wiz where ScenarioID = " . $id;
	$treat_r = mssql_query($treat_q);
	while ($treat = mssql_fetch_object($treat_r)){
		$tCount += 1;
		$tID = $treat->TreatmentID;
		$tName = $treat->TreatmentType_Name;
		$ttypeID = $treat->TreatmentType_ID;
		$tClass = $treat->Treatment_Class;
		$tValue = $treat->Treatment_Value;
		$tPerReduce = $treat->Treatment_PerReduce;
		$tUnitMet = $treat->Treatment_UnitMetric;
		$tMetVal = $treat->Treatment_MetricValue;
		$tCostTC = $treat->Cost_TC_Input;
		$tCostOM = $treat->Cost_OM_Input;
		$tAcreage = $treat->Treatment_Acreage;
		$tParcels = $treat->Treatment_Parcels;
		$POLY = $treat->POLY_STRING;
		$customPoly = $treat->Custom_POLY;
		$tCapCost = $treat->Cost_Capital;
		$tOMCost = $treat->Cost_OM;
		$tCollectionCost = $treat->Cost_Collection;
		$tTransportCost = $treat->Cost_TransportDisposal;
		$tNonconstCost = $treat->Cost_NonConstruction;
		$tMonitorCost = $treat->Cost_Monitor;
		$tTotalCost = $treat->Cost_Total;
		$tNReduction = $treat->Nload_Reduction;

		//get treatment row from matrix
		$tech_q = "Select * from TBL_Dev.dbo.TechMatrix where TechnologyID = " . $ttypeID;
		$tech_r = mssql_query($tech_q);
		while ($tech = mssql_fetch_object($tech_r)){
			$capVar = $tech->CapCost_High - $tech->CapCost_Low;
			$omVar = $tech->OMCost_High - $tech->OMCost_Low;
			$capFTE = $tech->capFTE;
			$omFTE = $tech->omFTE;
			$resil = $tech->Resilience;
			$years = $tech->UsefulYears;
			$compat = $tech->Compat;
			$NRemovalH = $tech->NRemoval_lbs_High;
			$NRemovalL = $tech->NRemoval_lbs_Low;
			$tVarPRank = $tech->VarP_Rank;
			$tProj_kg = $tech->ProjectCost_kg;
			$tOM_kg = $tech->OMCost_kg;
			$tLC_kg = $tech->LifeCycleCost_kg;
			$tPerfHigh = $tech->PctRemoval_high;
			$tPerfLow = $tech->PctRemoval_low;
			$tNewCompat = $tech->NewCompat;
		};
		$newCap += ($tProj_kg*$tNReduction)/$totalNreduc;
		$newOM += ($tOM_kg*$tNReduction)/$totalNreduc;
		$newVarC += ($tLC_kg*$tNReduction)/$totalNreduc;
		//GC
		$oldJobs += (($tCapCost*$capFTE)+($tOMCost*$omFTE))/1000000;
		$newJobs += (($tProj_kg*$tNReduction*$capFTE) + ($tOM_kg*$tNReduction*$omFTE))/1000000;
		//PVLA
		$newYears += ($years)*($tNReduction/$totalNreduc);
		$newVarP += ($tPerfHigh - $tPerfLow)*($tNReduction/$totalNreduc);
		//FloodResil

		//get GC, FZ if custom poly
		if ($customPoly == 1){
			$custom_q = "declare @poly geometry;
						set @poly = geometry::STGeomFromText('".$POLY."', 0);
						select * from [TBL_Dev].[dbo].[WIN] where SHAPE.STIntersects(@poly) = 1 and SUBWATER_ID IN " . $subwatersheds . ";";
			$custom_r = mssql_query($custom_q);	
			$treatGC = 0;
			$treatFZ = 0;
			while ($tpar = mssql_fetch_object($custom_r)){
				if ($tpar->EconDevType !== "Limited Development Area" && $tpar->EconDevType !== "Priority Protection Area"){$treatGC += $tNewCompat;}
				if ($tpar->DensityCat == 5){$treatGC+=0;}
				if ($tpar->DensityCat == 4){$treatGC+=1;}
				if ($tpar->DensityCat == 3){$treatGC+=2;}
				if ($tpar->DensityCat == 2){$treatGC+=3;}
				if ($tpar->DensityCat == 1){$treatGC+=4;}
				if ($tpar->BioMap2 == 2){$treatGC += $tNewCompat;}
				if ($tpar->CWMP == 2){$treatGC += $tNewCompat;}
				if ($tpar->NaturalAttenuation > 0.5){$treatGC+=$tNewCompat;}
				if ($tpar->NewSLIRM !== 1){$treatGC+=$tNewCompat;}
			
				$treatFZ += $tpar->NewSLIRM;
			}
			if ($tClass == "In-Embayment"){
				$newGC += (14)*($tNReduction/$totalNreduc);
			}else{
				$newGC += ($treatGC/$tParcels)*($tNReduction/$totalNreduc);
			}
			$floodSum += $treatFZ*$resil;
		//get GC, FZ if embayment-wide
		} else {
			$treatGC = 0;
			while ($par_row = mssql_fetch_object($shape_r)){
				if ($par_row->EconDevType !== "Limited Development Area" && $par_row->EconDevType !== "Priority Protection Area"){$treatGC += $tNewCompat;}
				if ($par_row->DensityCat == 5){$treatGC+=0;}
				if ($par_row->DensityCat == 4){$treatGC+=1;}
				if ($par_row->DensityCat == 3){$treatGC+=2;}
				if ($par_row->DensityCat == 2){$treatGC+=3;}
				if ($par_row->DensityCat == 1){$treatGC+=4;}
				if ($par_row->BioMap2 == 2){$treatGC += $tNewCompat;}
				if ($par_row->CWMP == 2){$treatGC += $tNewCompat;}
				if ($par_row->NaturalAttenuation > 0.5){$treatGC+=$tNewCompat;}
				if ($par_row->NewSLIRM !== 1){$treatGC+=$tNewCompat;}		
			}
			if ($tClass == "In-Embayment"){
				$newGC += (14)*($tNReduction/$totalNreduc);
			}else{
				$newGC += ($treatGC/$tParcels)*($tNReduction/$totalNreduc);
			}
			$floodSum += $parFZcount*$resil;
		};	
	};//end treatment while loop
		
	//calculate TBL raw scores
	if ($embayNreduc !== null){
		$pvla = ((($embayNreduc*$slope+$intercept)/($embayNcalc*$slope+$intercept))*0.61*$waterfront_prop_value + $total_prop_value)/$total_prop_value;
	}else{
		$pvla = 1;
	}
	if ($parFZcount > 0 ){
		$flood_ratio = ($floodSum/$tCount)/$parFZcount;
	} else {
		$flood_ratio = "NO FLOOD ZONE PARCELS";
	}
	
	//generate scoring scales
	$capArray = [];
	$omArray = [];
	$lcArray = [];
	$perfArray = [];
	$yearsArray = [];
	$jobsArray = [];
	$score_q = "Select ProjectCost_kg,OMCost_kg,LifeCycleCost_kg,PctRemoval_high,PctRemoval_low,UsefulYears,capFTE,omFTE from TBL_Dev.dbo.TechMatrix";
	$score_r = mssql_query($score_q);
	while ($row = mssql_fetch_object($score_r)){
			$delta = $row->PctRemoval_high-$row->PctRemoval_low;
			array_push($capArray,$row->ProjectCost_kg);
			array_push($omArray,$row->OMCost_kg);
			array_push($lcArray,$row->LifeCycleCost_kg);
			array_push($perfArray,$delta);
			array_push($yearsArray,$row->UsefulYears);
			$job = (($row->ProjectCost_kg*$totalNreduc*$row->capFTE) + ($row->OMCost_kg*$totalNreduc*$row->omFTE))/1000000;
			array_push($jobsArray,$job);
	}
	$arrays = [$capArray,$omArray,$lcArray,$perfArray,$yearsArray,$jobsArray];

	$k_d = [];
	for ($i=10;$i<=101;$i+=10){
		$n = ($i/100)*(count($capArray)-1)+1;
		$n_explode = explode(".",strval($n));
		$k = floatval($n_explode[0]);
		$d = intval($n_explode[1])/10;
		array_push($k_d,[$i,$k,$d]);
	}
	
	$percentiles = [];
	for ($a = 0;$a<count($arrays);++$a){
		$this_array = $arrays[$a];
		$sort = sort($this_array);
		$these_pcts = [];
		for ($b=0;$b<count($k_d);++$b){
			$k = intval($k_d[$b][1]);
			$d = $k_d[$b][2];
			$vp = $this_array[$k-1]+$d*($this_array[$k]-$this_array[$k-1]);//k-1 because of array indexing
			array_push($these_pcts,$vp);
		}
		//var_dump($this_array);
		//var_dump($these_pcts);
		array_push($percentiles,$these_pcts);
	}
	$capPercentile = $percentiles[0];
	$omPercentile = $percentiles[1];
	$lcPercentile = $percentiles[2];
	$perfPercentile = $percentiles[3];
	$yearsPercentile = $percentiles[4];
	$jobsPercentile = $percentiles[5];
	
	if ($tCount>0){
						//capital cost
						if ($newCap <= $capPercentile[0]){
							$CapitalCostScore = 10;
                        }; if ($capPercentile[0] < $newCap && $newCap <= $capPercentile[1]){
                            $CapitalCostScore = 9;
                        }; if ($capPercentile[1] < $newCap && $newCap <= $capPercentile[2]){
                            $CapitalCostScore = 8;
                        }; if ($capPercentile[2] < $newCap && $newCap <= $capPercentile[3]){
                            $CapitalCostScore = 7;
                        }; if ($capPercentile[3] < $newCap && $newCap <= $capPercentile[4]){
                            $CapitalCostScore = 6;
                        }; if ($capPercentile[4] < $newCap && $newCap <= $capPercentile[5]){
                            $CapitalCostScore = 5;
                        }; if ($capPercentile[5] < $newCap && $newCap <= $capPercentile[6]){
                            $CapitalCostScore = 4;
                        }; if ($capPercentile[6] < $newCap && $newCap <= $capPercentile[7]){
                            $CapitalCostScore = 3;
                        }; if ($capPercentile[7] < $newCap && $newCap <= $capPercentile[8]){
                            $CapitalCostScore = 2;
                        };if ($newCap > $capPercentile[8]){
							$CapitalCostScore = 1;
						};
						//om cost		
						if ($newOM <= $omPercentile[0]){
							$OMCostScore = 10;
                        }; if ($omPercentile[0] < $newOM && $newOM <= $omPercentile[1]){
                            $OMCostScore = 9;
                        }; if ($omPercentile[1] < $newOM && $newOM <= $omPercentile[2]){
                            $OMCostScore = 8;
                        }; if ($omPercentile[2] < $newOM && $newOM <= $omPercentile[3]){
                            $OMCostScore = 7;
                        }; if ($omPercentile[3] < $newOM && $newOM <= $omPercentile[4]){
                            $OMCostScore = 6;
                        }; if ($omPercentile[4] < $newOM && $newOM <= $omPercentile[5]){
                            $OMCostScore = 5;
                        }; if ($omPercentile[5] < $newOM && $newOM <= $omPercentile[6]){
                            $OMCostScore = 4;
                        }; if ($omPercentile[6] < $newOM && $newOM <= $omPercentile[7]){
                            $OMCostScore = 3;
                        }; if ($omPercentile[7] < $newOM && $newOM <= $omPercentile[8]){
                            $OMCostScore = 2;
                        };if ($newOM > $omPercentile[8]){
							$OMCostScore = 1;
						};
						//lifecycle cost
						if ($newVarC <= $lcPercentile[0]){
							$LCCostScore = 10;
                        }; if ($lcPercentile[0] < $newVarC && $newVarC <= $lcPercentile[1]){
                            $LCCostScore = 9;
                        }; if ($lcPercentile[1] < $newVarC && $newVarC <= $lcPercentile[2]){
                            $LCCostScore = 8;
                        }; if ($lcPercentile[2] < $newVarC && $newVarC <= $lcPercentile[3]){
                            $LCCostScore = 7;
                        }; if ($lcPercentile[3] < $newVarC && $newVarC <= $lcPercentile[4]){
                            $LCCostScore = 6;
                        }; if ($lcPercentile[4] < $newVarC && $newVarC <= $lcPercentile[5]){
                            $LCCostScore = 5;
                        }; if ($lcPercentile[5] < $newVarC && $newVarC <= $lcPercentile[6]){
                            $LCCostScore = 4;
                        }; if ($lcPercentile[6] < $newVarC && $newVarC <= $lcPercentile[7]){
                            $LCCostScore = 3;
                        }; if ($lcPercentile[7] < $newVarC && $newVarC <= $lcPercentile[8]){
                            $LCCostScore = 2;
                        };if ($newVarC > $lcPercentile[8]){
							$LCCostScore = 1;
						};
						//variability in performance
						if ($newVarP <= $perfPercentile[0]){
							$VarPerfScore = 10;
                        }; if ($perfPercentile[0] < $newVarP && $newVarP <= $perfPercentile[1]){
                            $VarPerfScore = 9;
                        }; if ($perfPercentile[1] < $newVarP && $newVarP <= $perfPercentile[2]){
                            $VarPerfScore = 8;
                        }; if ($perfPercentile[2] < $newVarP && $newVarP <= $perfPercentile[3]){
                            $VarPerfScore = 7;
                        }; if ($perfPercentile[3] < $newVarP && $newVarP <= $perfPercentile[4]){
                            $VarPerfScore = 6;
                        }; if ($perfPercentile[4] < $newVarP && $newVarP <= $perfPercentile[5]){
                            $VarPerfScore = 5;
                        }; if ($perfPercentile[5] < $newVarP && $newVarP <= $perfPercentile[6]){
                            $VarPerfScore = 4;
                        }; if ($perfPercentile[6] < $newVarP && $newVarP <= $perfPercentile[7]){
                            $VarPerfScore = 3;
                        }; if ($perfPercentile[7] < $newVarP && $newVarP <= $perfPercentile[8]){
                            $VarPerfScore = 2;
                        };if ($newVarP > $perfPercentile[8]){
							$VarPerfScore = 1;
						};
						//useful years
						if ($newYears <= $yearsPercentile[0]){
							$YearsScore = 1;
                        }; if ($yearsPercentile[0] < $newYears && $newYears <= $yearsPercentile[1]){
                            $YearsScore = 2;
                        }; if ($yearsPercentile[1] < $newYears && $newYears <= $yearsPercentile[2]){
                            $YearsScore = 3;
                        }; if ($yearsPercentile[2] < $newYears && $newYears <= $yearsPercentile[3]){
                            $YearsScore = 4;
                        }; if ($yearsPercentile[3] < $newYears && $newYears <= $yearsPercentile[4]){
                            $YearsScore = 5;
                        }; if ($yearsPercentile[4] < $newYears && $newYears <= $yearsPercentile[5]){
                            $YearsScore = 6;
                        }; if ($yearsPercentile[5] < $newYears && $newYears <= $yearsPercentile[6]){
                            $YearsScore = 7;
                        }; if ($yearsPercentile[6] < $newYears && $newYears <= $yearsPercentile[7]){
                            $YearsScore = 8;
                        }; if ($yearsPercentile[7] < $newYears && $newYears <= $yearsPercentile[8]){
                            $YearsScore = 9;
                        };if ($newYears > $yearsPercentile[8]){
							$YearsScore = 10;
						};
						
						//jobs created
						if ($newJobs <= $jobsPercentile[0]){
							$JobsScore = 1;
                        }; if ($jobsPercentile[0] < $newJobs && $newJobs <= $jobsPercentile[1]){
                            $JobsScore = 2;
                        }; if ($jobsPercentile[1] < $newJobs && $newJobs <= $jobsPercentile[2]){
                            $JobsScore = 3;
                        }; if ($jobsPercentile[2] < $newJobs && $newJobs <= $jobsPercentile[3]){
                            $JobsScore = 4;
                        }; if ($jobsPercentile[3] < $newJobs && $newJobs <= $jobsPercentile[4]){
                            $JobsScore = 5;
                        }; if ($jobsPercentile[4] < $newJobs && $newJobs <= $jobsPercentile[5]){
                            $JobsScore = 6;
                        }; if ($jobsPercentile[5] < $newJobs && $newJobs <= $jobsPercentile[6]){
                            $JobsScore = 7;
                        }; if ($jobsPercentile[6] < $newJobs && $newJobs <= $jobsPercentile[7]){
                            $JobsScore = 8;
                        }; if ($jobsPercentile[7] < $newJobs && $newJobs <= $jobsPercentile[8]){
                            $JobsScore = 9;
                        };if ($newJobs > $jobsPercentile[8]){
							$JobsScore = 10;
						};
						
						//growth compatibility
						if ($newGC/14 <= 0.1) {
                            $GrowthCompScore = 1;
                        }; if (0.1 < $newGC/14 && $newGC/14 <= 0.2) {
                            $GrowthCompScore = 2;
                        }; if (0.2 < $newGC/14 && $newGC/14 <= 0.3) {
                            $GrowthCompScore = 3;
                        }; if (0.3 < $newGC/14 && $newGC/14 < 0.4) {
                            $GrowthCompScore = 4;
                        }; if (0.4 < $newGC/14 && $newGC/14 < 0.5) {
                            $GrowthCompScore = 5;
                        }; if (0.5 < $newGC/14 && $newGC/14 <= 0.6) {
                            $GrowthCompScore = 6;
                        }; if (0.6 < $newGC/14 && $newGC/14 <= 0.7) {
                            $GrowthCompScore = 7;
                        }; if (0.7 < $newGC/14 && $newGC/14 <= 0.8) {
                            $GrowthCompScore = 8;
                        }; if (0.8 < $newGC/14 && $newGC/14 <= 0.9) {
                            $GrowthCompScore = 9;
                        };if (0.9 < $newGC/14) {
                            $GrowthCompScore = 10;
                        };
						
						//pvla
						if ($pvla <= 1.061) {
                            $PropValLossAvoidedScore = 1;
                        }; if (1.061 < $pvla && $pvla <= 1.122) {
                            $PropValLossAvoidedScore = 2;
                        }; if (1.122 < $pvla && $pvla <= 1.183) {
                            $PropValLossAvoidedScore = 3;
                        }; if (1.183 < $pvla && $pvla <= 1.244) {
                            $PropValLossAvoidedScore = 4;
                        }; if (1.244 < $pvla && $pvla <= 1.305) {
                            $PropValLossAvoidedScore = 5;
                        }; if (1.305 < $pvla && $pvla <= 1.366) {
                            $PropValLossAvoidedScore = 6;
                        }; if (1.366 < $pvla && $pvla <= 1.427) {
                            $PropValLossAvoidedScore = 7;
                        }; if (1.427 < $pvla && $pvla <= 1.498) {
                            $PropValLossAvoidedScore = 8;
                        }; if (1.498 < $pvla && $pvla <= 1.549) {
                            $PropValLossAvoidedScore = 9;
                        };if (1.549 < $pvla) {
                            $PropValLossAvoidedScore = 10;
                        };
						
						//flood resilience
						if ($flood_ratio <= 0.1 && $parFZcount > 0){
                            $FloodScore = 1;
                        }; if (0.1 < $flood_ratio && $flood_ratio <= 0.2){
                            $FloodScore = 2;
                        }; if (0.2 < $flood_ratio && $flood_ratio <= 0.3){
                            $FloodScore = 3;
                        }; if (0.3 < $flood_ratio && $flood_ratio <= 0.4){
                            $FloodScore = 4;
                        }; if (0.4 < $flood_ratio && $flood_ratio <= 0.5){
                            $FloodScore = 5;
                        }; if (0.5 < $flood_ratio && $flood_ratio <= 0.6){
                            $FloodScore = 6;
                        }; if (0.6 < $flood_ratio && $flood_ratio <= 0.7){
                            $FloodScore = 7;
                        }; if (0.7 < $flood_ratio && $flood_ratio <= 0.8){
                            $FloodScore = 8;
                        }; if (0.8 < $flood_ratio && $flood_ratio <= 0.9){
                            $FloodScore = 9;
                        }; if (0.9 < $flood_ratio) {
                            $FloodScore = 10;
                        };if ($parFZcount == 0){
							$FloodScore = 0;
						};
						
	
	$scenSummary->Area = $area;
	$scenSummary->Key = $key;
	$scenSummary->Name = $location;
	$scenSummary->Parcels = $parAll;
	$scenSummary->Acreage = $scenarioAcreage;
	$scenSummary->TotalTarget = $totalTarget;
	$scenSummary->SepticTarget = $septicTarget;
	$scenSummary->Initial->TotalN = $totalN;
	$scenSummary->Initial->SepticN = $septicN;
	$scenSummary->Initial->FertN = $fertN;
	$scenSummary->Initial->StormN = $stormN;
	$scenSummary->Calculated->TotalN = $totalNcalc;
	$scenSummary->Calculated->SepticN = $septicNcalc;
	$scenSummary->Calculated->FertN = $fertNcalc;
	$scenSummary->Calculated->StormN = $swNcalc;
	$scenSummary->Calculated->GroundN = $gwNcalc;
	$scenSummary->Calculated->InEmbayN = $embayNcalc;
	$scenSummary->Reduction->TotalN = $totalNreduc;
	$scenSummary->Reduction->SepticN = $septicNreduc;
	$scenSummary->Reduction->FertN = $fertNreduc;
	$scenSummary->Reduction->StormN = $swNreduc;
	$scenSummary->Reduction->GroundN = $gwNreduc;
	$scenSummary->Reduction->InEmbayN = $embayNreduc;
	$scenSummary->Counts->WF = $parWFcount;
	$scenSummary->Counts->WFTAV = $waterfront_prop_value;
	$scenSummary->Counts->FZ = $parFZcount;
	$scenSummary->Counts->TAV = $total_prop_value;
	$scenSummary->NConv->Slope = $slope;
	$scenSummary->NConv->Intercept = $intercept;
	
	$scenSummary->Scores->CapCost = [$newCap,$CapitalCostScore];
	$scenSummary->Scores->OMCost = [$newOM,$OMCostScore];
	$scenSummary->Scores->VarCost = [$newVarC,$LCCostScore];
	
	$scenSummary->Scores->GC = [$newGC,$GrowthCompScore];
	$scenSummary->Scores->Jobs = [$newJobs,$JobsScore];
	$scenSummary->Scores->PVLA = [$pvla,$PropValLossAvoidedScore];
	
	$scenSummary->Scores->Years = [$newYears,$YearsScore];
	$scenSummary->Scores->VarPerf = [$newVarP,$VarPerfScore];
	$scenSummary->Scores->Resil = [$flood_ratio,$FloodScore];

	echo json_encode($scenSummary);
	}else{
		echo "<p>Ain't nothin' in this scenario</p>";
	}
}//while scenario

?>