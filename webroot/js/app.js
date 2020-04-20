//Write your javascript here, or roll your own. It's up to you.
//Make your ajax call to http://localhost:8765/api/index.php here
var resultTableColumns = [
	{
		class: "name",
		title: "Name",
		callback: addNameCell
	},
	{
		class: "code",
		title: "Code",
		callback: add3codeCell
	},
	{
		class: "flag",
		title: "",
		callback: addFlagImgCell
	},
	{
		class: "reg",
		title: "Region",
		callback: addRegionCell
	},
	{
		class: "subReg",
		title: "Subregion",
		callback: addSubregionCell
	},
	{
		class: "pop",
		title: "Pop.",
		callback: addPopulationCell
	},
	{
		class: "langs",
		title: "Languages",
		callback: addLanguageCell
	}
];
function initPage() {
	//clear search
	document.getElementById("searchForm").reset();
	//build table. Order matters, so I want it in the same file the rows are created
	const table = document.getElementById("tblResult");
	const thead = table.createTHead();
	const hrow = thead.insertRow(0);
	appendCol(table).classList += "name";
	appendHeaderCell(hrow).innerHTML = "Name";
	appendCol(table).classList += "code";
	appendHeaderCell(hrow).innerHTML = "Code";
	appendCol(table).classList += "flag";
	appendHeaderCell(hrow);
	appendCol(table).classList += "reg";
	appendHeaderCell(hrow).innerHTML = "Region";
	appendCol(table).classList += "subReg";
	appendHeaderCell(hrow).innerHTML = "Subregion";
	appendCol(table).classList += "pop";
	appendHeaderCell(hrow).innerHTML = "Pop.";
	appendCol(table).classList += "langs";
	appendHeaderCell(hrow).innerHTML = "Languages";
}
function searchFunction() {
	setResultErrorString("");
	replaceResultTableBody();
	replaceResultSummaryList();
	try {
		const searchString = document.getElementById("searchText").value;
		if (searchString == "") throw "Empty search string."
		const mode = document.querySelector('input[name = "mode"]:checked').value;
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
function queryStatueChange() {
    if (this.readyState == 4 && this.status == 200) {
		const newBody = document.createElement('tbody');
		var summary = {regions: {}, total: 0};
		try{
			if (!this.responseText || this.responseText == "") throw "No result";
			const result = JSON.parse(this.responseText);
			if (!result || result.length == 0) throw "No results";
			for (let country of result){
				addResultRow(newBody, country, summary);
			}
   		} catch (err) {
   			setResultErrorString("Error: " + err);
   		}
   		emitSummary(summary);
   		replaceResultTableBody(newBody);
    }
}
function emitSummary(summary){
	// var summary = {
	// 	regions: {
	// 		"Americas": {
	// 			count: 4,
	// 			subs: {
	// 				"Caribbean": 13,
	// 				"South America" : 3
	// 			}
	// 		},
	// 		"Europe": {
	// 			count: 2,
	// 			subs: {
	// 				"North Europe": 1
	// 			}
	// 		}
	// 	},
	// 	total: 250
	// };
	var sumList = document.createElement("ul");
	sumList.innerHTML = "Total: " + summary.total;
	for (let region in summary.regions) {
		let liReg = document.createElement("li");
		liReg.innerHTML = region + ": " + summary.regions[region].count;
		let ulSubs = document.createElement("ul");
		for (let sub in summary.regions[region].subs){
			let liSub = document.createElement("li");
			liSub.innerHTML = sub + ": " + summary.regions[region].subs[sub];
			ulSubs.appendChild(liSub);
		}
		liReg.appendChild(ulSubs);
		sumList.appendChild(liReg);
	}
	replaceResultSummaryList(sumList);
}
function summarizeCountry(summary, country){
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
function addNameCell(cell, country){
	cell.innerHTML = country.name;
}
function add3codeCell(cell, country){
	cell.innerHTML = country.alpha3Code;
}
function addFlagImgCell(cell, country){
	const img = document.createElement("img");
	img.src = country.flag;
	img.style = "width: 100%; height: auto;";
	cell.appendChild(img);
}
function addRegionCell(cell, country){
	cell.innerHTML = country.region;
}
function addSubregionCell(cell, country){
	cell.innerHTML = country.subregion;
}
function addPopulationCell(cell, country){
	cell.innerHTML = country.population.toLocaleString();
	cell.classList += "pop";
}
function addLanguageCell(cell, country){
	cell.innerHTML = languageArrayToString(country.languages);
}
function addResultRow(body, country, summary){
	summarizeCountry(summary, country);
	const row = body.insertRow(body.length);
	for(let i = 0; i<7; i++){
		let cell = row.insertCell(i);
		resultTableColumns[i].callback(cell, country);
	}
}
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
function appendHeaderCell(row){
	const cell = document.createElement("th");
	row.appendChild(cell);
	return cell;
}
function appendCol(table){
	const col = document.createElement("col");
	table.appendChild(col);
	return col;
}
function setResultErrorString(string){
	const resultEl = getResultStringEl();
	if(resultEl){
		resultEl.innerHTML = string;
	} else {
		alert("Result: " + string);
	}
}
function getResultStringEl(){
	return document.getElementById("result");
}
function replaceResultTableBody(newBod){
	const oldBody = document.getElementById("tblResult").tBodies[0];
	if (!newBod) {
		newBod = document.createElement('tbody');
	}
	oldBody.parentNode.replaceChild(newBod, oldBody);
}
function replaceResultSummaryList(newList){
	const oldSumm = document.getElementById("listSumm");
	if (!newList) {
		newList = document.createElement('ul');
	}
	newList.id = "listSumm";
	oldSumm.parentNode.replaceChild(newList, oldSumm);
}
if (window.history.replaceState) {
	window.history.replaceState(null, null, window.location.href);
}