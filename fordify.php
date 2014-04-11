<?php

require ('db-config.php');

$mysqli = new mysqli($dbhost, $db_username, $db_password, $dbn);
			if($mysqli->connect_errno) {
 			echo "Connection Failed: " . $mysqli->connect_errno;
			}
		
$query = "SELECT `ford_position` FROM `questions`";
$queryInsert = "INSERT INTO `responses` (`score`) VALUES (?)";
$queryFinal = "SELECT `score` FROM `responses`";

$userPositionArray = array();
$youArray = array();

$dataReturn = array();

$i = 0;

foreach($_POST as $key => $value ){
    $user_array[$i] = filter_var($value, FILTER_SANITIZE_NUMBER_INT);
	$i++;
}

$i = 0;
$scoreUser = 0;
$fordScore = 0;

if ($stmt = $mysqli->prepare($query)) {

    /* execute statement */
    $stmt->execute();

    /* bind result variables */
    $stmt->bind_result($ford_position);

    /* fetch values */
    while ($stmt->fetch()) {
	
		$fordScore += $ford_position;// Rob Ford
		$scoreUser += $user_array[$i];//Respondent
		
		$i++;
    }
	
	$positionAnalysis = $scoreUser / $fordScore;
	
	$youArray["youScore"] = $scoreUser;
	$youArray["fordScore"] = $fordScore;
	
	$fordPositionScore = $fordScore;
	
	if ($positionAnalysis <= 0.2){
			$youArray["overall"] = 1;
		} else if ($positionAnalysis > 0.2 && $positionAnalysis <= 0.4){
			$youArray["overall"] = 2;
		} else if ($positionAnalysis > 0.4 && $positionAnalysis <= 0.6){
			$youArray["overall"] = 3;
		} else if ($positionAnalysis > 0.6 && $positionAnalysis <= 0.8){
			$youArray["overall"] = 4;
		} else {
			$youArray["overall"] = 5;
		}

	$dataReturn["you"] = $youArray;
		
    /* close statement */
    $stmt->close();
}

if ($stmt = $mysqli->prepare($queryInsert)) {

	$stmt-> bind_param('i', $scoreUser);

    /* execute statement */
    $stmt-> execute();

    /* close statement */
    $stmt-> close();
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