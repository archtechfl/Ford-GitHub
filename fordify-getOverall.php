<?php

require ('db-config.php');

$mysqli = new mysqli($dbhost, $db_username, $db_password, $dbn);
			if($mysqli->connect_errno) {
 			echo "Connection Failed: " . $mysqli->connect_errno;
			}
		
$query = "SELECT `ford_position` FROM `questions`";
$queryFinal = "SELECT `score` FROM `responses`";

$dataReturn = array();

$fordScore = 0;

if ($stmt = $mysqli->prepare($query)) {

    /* execute statement */
    $stmt->execute();

    /* bind result variables */
    $stmt->bind_result($ford_position);

    /* fetch values */
    while ($stmt->fetch()) {
	
		$fordScore += $ford_position;// Rob Ford
    }
	
	$fordPositionScore = $fordScore;
	
    /* close statement */
    $stmt->close();
}

$sD = 0;
$d = 0;
$n = 0;
$a = 0;
$sA = 0;

//Provide base zero for every entry
$userPositionArray["sD"] = $sD; 
$userPositionArray["d"] = $d; 
$userPositionArray["n"] = $n; 
$userPositionArray["a"] = $a; 
$userPositionArray["sA"] = $sA; 

if ($stmt = $mysqli->prepare($queryFinal)) {

    /* execute statement */
    $stmt-> execute();
	
	$stmt-> bind_result($score);
	
	/* fetch values */
    while ($stmt->fetch()) {
	
		$overall_respondent_scale = $score / $fordPositionScore;
	
		if ($overall_respondent_scale <= 0.2){
			$sD++;
			$userPositionArray["sD"] = $sD; 
		} else if ($overall_respondent_scale > 0.2 && $overall_respondent_scale <= 0.4){
			$d++;
			$userPositionArray["d"] = $d; 
		} else if ($overall_respondent_scale > 0.4 && $overall_respondent_scale <= 0.6){
			$n++;
			$userPositionArray["n"] = $n; 
		} else if ($overall_respondent_scale > 0.6 && $overall_respondent_scale <= 0.8){
			$a++;
			$userPositionArray["a"] = $a; 
		} else {
			$sA++;
			$userPositionArray["sA"] = $sA; 
		}
		
    }
	
	$dataReturn["overall"] = $userPositionArray;
	
	echo json_encode($dataReturn);

    /* close statement */
    $stmt->close();
}

/* close connection */
$mysqli->close();

?>