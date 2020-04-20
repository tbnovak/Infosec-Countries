//Write your javascript here, or roll your own. It's up to you.
//Make your ajax call to http://localhost:8765/api/index.php here
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
	appendHeaderCell(hrow).innerHTML;
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
			for (country of result){
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
	// var regs = [];
	// for(var reg in summary.regions){
	// 	regs.push(reg + ": " + summary.regions[reg]);
	// }
	// alert(regs.join("\n"));
	// var subregs = [];
	// for(var subreg in summary.subRegions){
	// 	subregs.push(subreg + ": " + summary.subRegions[subreg]);
	// }
	// alert(subregs.join("\n"));
	// alert("total: " + summary.total);
	var summary2 = {
		regions: {
			"Americas": {
				count: 4,
				subs: {
					"Caribbean": 13,
					"South America" : 3
				}
			},
			"Europe": {
				count: 2,
				subs: {
					"North Europe": 1
				}
			}
		},
		total: 250
	};
	var alertStr = ""
	for(var region in summary.regions) {
		alertStr += region + ": " + summary.regions[region].count + "\n";
		for(var sub in summary.regions[region].subs){
			alertStr += "-" + sub + ": " + summary.regions[region].subs[sub] + "\n";
		}
	}
	alert(alertStr);
}
function summarizeCountry(summary, country){
	if(!summary.regions[country.region]) {
		summary.regions[country.region] = {
			count: 1,
			subs: {}
		};
	} else {
		summary.regions[country.region].count++;
	}
	if(!summary.regions[country.region].subs[country.subregion]){
		summary.regions[country.region].subs[country.subregion] = 1;
	} else {
		summary.regions[country.region].subs[country.subregion]++;
	}
	summary.total++;
}
function addResultRow(body, country, summary){
	summarizeCountry(summary, country);
	const row = body.insertRow(body.length);
	row.insertCell(0).innerHTML = country.name;
	row.insertCell(1).innerHTML = country.alpha3Code;
	const img = document.createElement("img");
	img.src = country.flag;
	img.style = "width:100%;height:auto;";
	row.insertCell(2).appendChild(img);
	row.insertCell(3).innerHTML = country.region;
	row.insertCell(4).innerHTML = country.subregion;
	const cell = row.insertCell(5);
	cell.innerHTML = country.population.toLocaleString();
	cell.classList += "pop";
	row.insertCell(6).innerHTML = languageArrayToString(country.languages);
}
function languageArrayToString(languageArray){
	try{
		if (!languageArray) return "";
		var langs = [];
		for (lang of languageArray){
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
	oldBody.parentNode.replaceChild(newBod,oldBody);
}
if (window.history.replaceState) {
	window.history.replaceState(null, null, window.location.href);
}