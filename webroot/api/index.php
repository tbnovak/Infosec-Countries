<?php
/**
 * This is a template php file for your countries search.
 * Use as you will, or start over. It's up to you.
 */
function queryCountries($searchString){
	$url = "https://restcountries.eu/rest/v2/alpha/".$searchString;
	$result = file_get_contents($url);
	return $result;
}
header('Content-Type: application/json');
$obj = json_decode($_POST["q"],false);
$searchString = $obj->searchString;
//echo json_encode(queryCountries($searchString));
echo queryCountries($searchString);
?>