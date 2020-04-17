<?php
/**
 * This is a template php file for your countries search.
 * Use as you will, or start over. It's up to you.
 */
function popCmp($a,$b){
	return $a->population < $b->population;
}
function queryCountries($searchString){
	$fields="?fields=name;alpha2Code;alpha3Code;population;flag;region;subregion;languages;";
	if($searchString=="all"){
		$url="https://restcountries.eu/rest/v2/all";
		$fields.="altSpellings";
	}else{
		//search on: country name, full name, or code
		$url="https://restcountries.eu/rest/v2/name/".$searchString."?fullText=true";
	}
	$result = file_get_contents($url.$fields);
	$result = json_decode($result);
	usort($result, "popCmp");
	$result = json_encode($result);
	return $result;
}
header('Content-Type: application/json');
$obj = json_decode($_POST["q"],false);
$searchString = $obj->searchString;
echo queryCountries($searchString);
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