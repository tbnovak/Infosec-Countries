<?php
/**
 * This is a template php file for your countries search.
 * Use as you will, or start over. It's up to you.
 */
function popCmp($a, $b){
	return $a["population"] < $b["population"];
}
function sortCountriesByPop(&$json){
	if ($json) {
		$json = json_decode($json,true);
		usort($json,"popCmp");
		$json = json_encode($json);
	}
}
function nameSearch($url){
	$result = file_get_contents($url);
	sortCountriesByPop($result);
	return $result;
}
function queryCountries($searchString, $mode = "") {
	$fields = "fields=name;alpha2Code;alpha3Code;population;flag;region;subregion;languages";
	if ($searchString == "all") {
		$url = "https://restcountries.eu/rest/v2/all";
		$fields .= "altSpellings";
		return file_get_contents($url . "?" . $fields);
	} else {
		//search on: country name, full name, or code
		switch ($mode) {
			case 'fname':
				$url = "https://restcountries.eu/rest/v2/name/" . $searchString . "?fullText=true";
				return nameSearch($url . "?" . $fields);
				break;
			case 'code':
				$url = "https://restcountries.eu/rest/v2/alpha?codes=" . $searchString;
				return nameSearch($url);//."&".$fields);
				break;
			case 'name':
			default:
				$url = "https://restcountries.eu/rest/v2/name/" . $searchString;
				return nameSearch($url . "?" . $fields);
				break;
		}
	}
}
header('Content-Type: application/json');
$obj = json_decode($_POST["q"], false);
$searchString = $obj->searchString;
$mode = $obj->mode;
echo queryCountries($searchString,$mode);
/**
 * american samoa (4)
 * name: "American Samoa"
 * alpha2: "AS"
 * alpha3: "ASM"
 * alts: "AS","Amerika S~moa","Amelika S~moa","S~moa Amelika"
 *
 * Angola
 */
?>