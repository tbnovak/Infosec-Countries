<?php
/**
 * @author Tyler Novak
 * This is a php endpoint for the countries search.
 */
/**
 *  Compare 2 associative arrays with a 'population' property. Higher population sorts first
 *  @param{AArray}
 *  @param{AArray}
 *  @return{boolean} $a.population < $b.population
 */
function popCmp($a, $b){
	return $a["population"] < $b["population"];
}
/**
 *  Sort the JSON collection of countries by population (desc).
 *  NOTE: decodes then re-encodes the json. Caller should do the sorting if doing more than the sort
 *  @param{string} JSON collection of country objects
 */
function sortCountriesByPop(&$json){
	if ($json) {
		$json = json_decode($json,true);
		usort($json,"popCmp");
		$json = json_encode($json);
	}
}
/**
 *  Query given url, expecting to get back a collection of country objects. 
 *  Also sorts the results by population (desc.)
 *  @param{string} url
 *  @return{string} json encoded string
 */
function getCountryCollection($url){
	$result = file_get_contents($url);
	sortCountriesByPop($result);
	return $result;
}
/**
 *  Search for countries
 */
function searchCountries($searchString, $mode = "") {
	$fields = "fields=name;alpha2Code;alpha3Code;population;flag;region;subregion;languages;";
	if ($searchString == "searchall") {
		//debug. unlikely search string. non-destructive if performed
		$url = "https://restcountries.eu/rest/v2/all";
		$fields .= "altSpellings";
		return file_get_contents($url . "?" . $fields);
	} else {
		//search on: country name, full name, or code
		switch ($mode) {
			case 'fname':
				//more restrictive than 'name' but not certain how. 
				//"ch" = {Switzerland}
				//"chi", "chin" = {}
				//"china" = {China}
			    https://restcountries.eu/rest/v2/name/mexico?fullText=true&fields=name;nativeName;
				$url = "https://restcountries.eu/rest/v2/name/" . $searchString . "?fullText=true";
				return getCountryCollection($url . "&" . $fields);
				break;
			case 'code':
				//search by codes only. works with 2 and 3 codes
				$url = "https://restcountries.eu/rest/v2/alpha?codes=" . $searchString;
				return getCountryCollection($url . "&" . $fields);
				break;
			case 'name':
			default:
				//most permissive search
				//won't match all 3-codes. eg. "American Samoa" aka "AS" will not be inculded in search on "ASM"
				$url = "https://restcountries.eu/rest/v2/name/" . $searchString;
				return getCountryCollection($url . "?" . $fields);
				break;
		}
	}
}
header('Content-Type: application/json');
$obj = json_decode($_POST["q"], false);
$searchString = $obj->searchString;
$mode = $obj->mode;
echo searchCountries($searchString,$mode);
?>