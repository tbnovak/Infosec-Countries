/**
 * 
 *
 */
var resultTableColumns = [
	{
		class: "flag",
		title: "",
		callback: addFlagImgCell},
	{
		class: "name",
		title: "Name",
		callback: addNameCell},
	{
		class: "code",
		title: "Code",
		callback: add3codeCell},
	{
		class: "reg",
		title: "Region",
		callback: addRegionCell},
	{
		class: "subReg",
		title: "Subregion",
		callback: addSubregionCell},
	{
		class: "pop",
		title: "Pop.",
		callback: addPopulationCell},
	{
		class: "langs",
		title: "Languages",
		callback: addLanguageCell}
];
/**
 *  onLoad handler. Add col and thread elements to the result table.
 */
function initPage() {
	//clear search
	document.getElementById("searchForm").reset();
	//build table. Order matters, so I want it in the same file the rows are created
	const table = document.getElementById("tblResult");
	const thead = table.createTHead();
	const hrow = thead.insertRow(0);
	for (let i=0; i < resultTableColumns.length; i++){
		appendCol(table).classList += resultTableColumns[i].class;
		appendHeaderCell(hrow).innerHTML = resultTableColumns[i].title;
	}
}
/**
 *  form submit handler. Parse input, craft ajax, and send query.
 */
function searchFunction() {
	setResultErrorString("");
	replaceResultTableBody();
	replaceResultSummaryList();
	try {
		const searchString = document.getElementById("searchText").value;
		if (searchString == "") throw "Empty search string."
		const mode = document.querySelector("input[name = 'mode']:checked").value;
		const data = JSON.stringify({"searchString": searchString, "mode": mode});
	    const xmlhttp = new XMLHttpRequest();
	    xmlhttp.onreadystatechange = queryStatueChange;
	    xmlhttp.open("POST", "http://localhost:8765/api/index.php", true);
	    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    xmlhttp.send("q=" + data);
	}
	catch(err) {
		setResultErrorString("Error searching. " + err);
	}
	return false;
}
/**
 *  onreadystatechange handler. On success, populate result elements
 */
function queryStatueChange() {
    if (this.readyState == 4 && this.status == 200) {
		processResults(this.responseText);
    }
}
/**
 *  Parse query response. Make a row in the result table for each. 
 *  Add region info to summary, then display that.
 *  @param {string} responsetext. this.responseText from the ajax post. Expected JSON format. Handles null/empty responses
 */
function processResults(responseText){
	const newBody = document.createElement("tbody");
		var summary = {regions: {}, total: 0};
	try{
		if (!responseText || responseText == "") throw "No result";
		const result = JSON.parse(responseText);
		if(!result || result.length == 0) throw "No results";
		for (let country of result) {
			addResultRow(newBody, country);
			summarizeCountry(summary, country);
		}
	} catch (err) {
		setResultErrorString("Error: " + err);
	}
	replaceResultTableBody(newBody);
	emitSummary(summary);
}
/**
 * Convert summary object to nested ul/li elements including (sub)region names and frequencies. Replaces the summary list in the document
 * @param {object} summary 
 *		summary.total = total number of results.
 *		summary.regions[<regionName>].count = number of results in that region.
 *		summary.regions[<regionName>].subs[<subregionName>] = number of results in that subregion.
 */
function emitSummary(summary) {
	var sumList = document.createElement("ul");
	sumList.innerHTML = "Total: " + summary.total;
	for (let regionName in summary.regions) {
		let region = summary.regions[regionName];
		sumList.appendChild(makeRegionLi(regionName, region));
	}
	replaceResultSummaryList(sumList);
}
/**
 *  Make the li for a given region.
 *  @param{string} name
 *  @param{object} region. 
 *		region.count = number of results in that region.
 *		region.subs[<subregionName>] = number of results in that subregion.
 *  @return{li}
 */
function makeRegionLi(name, region) {
	var liReg = document.createElement("li");
	liReg.innerHTML = name + ": " + region.count;
	var ulSubs = document.createElement("ul");
	for (let sub in region.subs) {
		ulSubs.appendChild(makeSubregionLi(sub, region.subs[sub]));
	}
	liReg.appendChild(ulSubs);
	return liReg;
}
/**
 *  Make the li for a given subregion.
 *  @param{string} name
 *  @param{number} frequency
 *  @return{li}
 */
function makeSubregionLi(name, frequency) {
	var liSub = document.createElement("li");
	liSub.innerHTML = name + ": " + frequency;
	return liSub;
}
/**
 *  Break apart country object and update the summary tracking object.
 *  @param{object} summary. I/O.
 *		summary.total++.
 *		summary.regions[country.region].count++.
 *		summary.regions[country.regions].subs[country.subregion]++.
 *	@param{object} country 
 */
function summarizeCountry(summary, country) {
	const region = (country.region == "" ? "NONE" : country.region);
	const subreg = (country.subregion == "" ? "NONE" : country.subregion);
	if(!summary.regions[region]) {
		summary.regions[region] = {
			count: 1,
			subs: {}
		};
	} else {
		summary.regions[region].count++;
	}
	const subs = summary.regions[region].subs;
	subs[subreg] = (subs[subreg] || 0) + 1;
	summary.total++;
}
/**
 * Given a td element, set HTML for name display.
 * @param{td} cell.
 * @param{object} country 
 */
function addNameCell(cell, country){
	cell.innerHTML = country.name;
}
/**
 * Given a td element, set HTML for 3code display.
 * @param{td} cell.
 * @param{object} country 
 */
function add3codeCell(cell, country){
	cell.innerHTML = country.alpha3Code;
}
/**
 * Given a td element, set HTML for flag display.
 * @param{td} cell.
 * @param{object} country 
 */
function addFlagImgCell(cell, country){
	const img = document.createElement("img");
	img.src = country.flag;
	img.style = "width: 100%; height: auto;";
	cell.appendChild(img);
}
/**
 * Given a td element, set HTML for population display.
 * @param{td} cell.
 * @param{object} country 
 */
function addRegionCell(cell, country){
	cell.innerHTML = country.region;
}
/**
 * Given a td element, set HTML for population display.
 * @param{td} cell.
 * @param{object} country 
 */
function addSubregionCell(cell, country){
	cell.innerHTML = country.subregion;
}
/**
 * Given a td element, set HTML for population display.
 * @param{td} cell.
 * @param{object} country 
 */
function addPopulationCell(cell, country){
	cell.innerHTML = country.population.toLocaleString();
	cell.classList += "pop";
}
/**
 * Given a td element, set HTML for language display.
 * @param{td} cell.
 * @param{object} country 
 */
function addLanguageCell(cell, country){
	cell.innerHTML = languageArrayToString(country.languages);
}
/**
 * Add a tr element representing the country to the result table.
 * @param{tbody} body
 * @params{object} country
 */
function addResultRow(body, country){
	const row = body.insertRow(body.length);
	for(let i = 0; i<7; i++){
		let cell = row.insertCell(i);
		resultTableColumns[i].callback(cell, country);
	}
}
/**
 * .toString replacement for country.language, since it's not a simple string array
 * @param{object} languageArray
 */
function languageArrayToString(languageArray){
	try{
		if (!languageArray) return "";
		var langs = [];
		for (let lang of languageArray){
			langs.push(lang.name);
		}
		return langs.join(", ");
	} catch (err) {
		return err;
	}
}
/**
 *  Add a th element to the tr. In lieu of .insertCell which doesn't support th
 *  @param{tr} row
 *  @return{th}
 */
function appendHeaderCell(row){
	const cell = document.createElement("th");
	row.appendChild(cell);
	return cell;
}
/**
 *  Add a col element to the table. appendChild, but typed
 *  @param{table} table element
 *  @return{col}
 */
function appendCol(table){
	const col = document.createElement("col");
	table.appendChild(col);
	return col;
}
/**
 *  Write a user-facing error string to the document
 *  @param{string}
 */
function setResultErrorString(string){
	const resultEl = getResultErrorStringEl();
	if(resultEl){
		resultEl.innerHTML = string;
	} else {
		alert("Result: " + string);
	}
}
/**
 *  Get the element used for error strings
 *  @return{HTMLElement}
 */
function getResultErrorStringEl(){
	return document.getElementById("result");
}
/**
 *  Clobber the existing result tbody with a new one
 *  @param{tbody} new/bod
 */
function replaceResultTableBody(newBod){
	const oldBody = document.getElementById("tblResult").tBodies[0];
	if (!newBod) {
		newBod = document.createElement("tbody");
	}
	oldBody.parentNode.replaceChild(newBod, oldBody);
}
/**
 *  Clobberthe existing summary ul with a new one
 *  @param{ul} newList
 */
function replaceResultSummaryList(newList){
	const oldSumm = document.getElementById("listSumm");
	if (!newList) {
		newList = document.createElement("ul");
	}
	newList.id = "listSumm";
	oldSumm.parentNode.replaceChild(newList, oldSumm);
}
//on refresh, don't re-post
if (window.history.replaceState) {
	window.history.replaceState(null, null, window.location.href);
}