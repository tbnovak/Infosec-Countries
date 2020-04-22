/**
 *  @author Tyler Novak
 */
var resultTableColumns = [
	{
		class: "flag",
		title: "",
		makeCell: makeFlagImgCell},
	{
		class: "name",
		title: "Name",
		makeCell: makeNameCell},
	{
		class: "code",
		title: "Code",
		makeCell: make3codeCell},
	{
		class: "reg",
		title: "Region",
		makeCell: makeRegionCell},
	{
		class: "subreg",
		title: "Subregion",
		makeCell: makeSubregionCell},
	{
		class: "pop",
		title: "Pop.",
		makeCell: makePopulationCell},
	{
		class: "langs",
		title: "Languages",
		makeCell: makeLanguageCell}
];
/**
 *  onLoad handler. Clear the search field
 */
function initPage() {
	//clear search
	var input = document.getElementById("searchText");
	input.value = "";
	input.focus();
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
	    xmlhttp.onreadystatechange = queryStatusChange;
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
function queryStatusChange() {
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
	const newBody = document.createElement("div");
	newBody.classList += "table ";
	var summary = {regions: {}, total: 0};
	newBody.appendChild(makeHeaderRow());
	try{
		if (!responseText || responseText == "") throw "No result";
		const result = JSON.parse(responseText);
		if(!result || result.length == 0) throw "No results";
		for (let country of result) {
			newBody.appendChild(makeResultRow(country));
			summarizeCountry(summary, country);
		}
	} catch (err) {
		setResultErrorString("Error: " + err);
	}
	showResultsHeader();
	replaceResultTableBody(newBody);
	emitSummary(summary);
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
 *  Make the row for the top of the search result table.
 *  @return{div}
 */
function makeHeaderRow(){
	const headRow = document.createElement("div");
	headRow.classList += "row ";
	headRow.classList += "header ";
	for (let i = 0; i < resultTableColumns.length; i++){
		let cell = document.createElement("div");
		cell.innerHTML = resultTableColumns[i].title;
		cell.classList += "cell " + resultTableColumns[i].class + " ";
		headRow.appendChild(cell);
	}
	return headRow;
}
/**
 *  Make the row for a single search result.
 *  @param{Object} country
 *  @return{div} result row
 */
function makeResultRow(country){
	const row = document.createElement("div");
	row.classList += "row ";
	for(let i = 0; i < resultTableColumns.length; i++){
		let cell = resultTableColumns[i].makeCell(country);
		cell.classList += "cell " + resultTableColumns[i].class + " ";
		row.appendChild(cell);
	}
	return row;
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
	showSummaryHeader();
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
 *  @param{object} region
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
 * Given a td element, set HTML for name display.
 * @param{object} country 
 * @return{div} cell
 */
function makeNameCell(country){
	var cell = document.createElement("div");
	cell.innerHTML = country.name;
	cell.value = "Name";
	return cell;
}
/**
 * Given a td element, set HTML for 3code display.
 * @param{object} country 
 * @return{div} cell
 */
function make3codeCell(country){
	var cell = document.createElement("div");
	cell.innerHTML = country.alpha3Code;
	return cell;
}
/**
 * Given a td element, set HTML for flag display.
 * @param{object} country 
 * @return{div} cell
 */
function makeFlagImgCell(country){
	var cell = document.createElement("div");
	const img = document.createElement("img");
	img.src = country.flag;
	cell.appendChild(img);
	return cell;
}
/**
 * Given a td element, set HTML for population display.
 * @param{object} country 
 * @return{div} cell
 */
function makeRegionCell(country){
	var cell = document.createElement("div");
	cell.innerHTML = country.region;
	return cell;
}
/**
 * Given a td element, set HTML for population display.
 * @param{object} country 
 * @return{div} cell
 */
function makeSubregionCell(country){
	var cell = document.createElement("div");
	cell.innerHTML = country.subregion;
	return cell;
}
/**
 * Given a td element, set HTML for population display.
 * @param{object} country 
 * @return{div} cell
 */
function makePopulationCell(country){
	var cell = document.createElement("div");
	cell.innerHTML = country.population.toLocaleString();
	return cell;
}
/**
 * Given a td element, set HTML for language display.
 * @param{object} country 
 * @return{div} cell
 */
function makeLanguageCell(country){
	var cell = document.createElement("div");
	cell.innerHTML = languageArrayToString(country.languages);
	return cell;
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
 *  Write a user-facing error string to the document
 *  @param{string}
 */
function setResultErrorString(string){
	const resultEl = getResultErrorStringEl();
	if(resultEl){
		resultEl.innerHTML = string;
	} else {
		alert(string);
	}
}
/**
 *  Get the element used for error strings
 *  @return{HTMLElement}
 */
function getResultErrorStringEl(){
	return document.getElementById("resultErr");
}
/**
 *  Clobber the existing result tbody with a new one
 *  @param{tbody} new/bod
 */
function replaceResultTableBody(newBod){
	const oldBody = document.getElementById("tblResult");
	if (!newBod) {
		newBod = document.createElement("div");
	}
	newBod.id="tblResult";
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
/**
 * Show the header for the summary section of the page
 */
function showSummaryHeader(){
	document.getElementById("hSummary").style.visibility = "visible";
}
/**
 * Show the header for the result section of the page
 */
function showResultsHeader(){
	document.getElementById("hResults").style.visibility = "visible";
}
//on refresh, don't re-post
if (window.history.replaceState) {
	window.history.replaceState(null, null, window.location.href);
}