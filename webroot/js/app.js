//Write your javascript here, or roll your own. It's up to you.
//Make your ajax call to http://localhost:8765/api/index.php here
function initPage(){
	var table = document.getElementById("tblResult");
	var thead = table.createTHead();
	var hrow = thead.insertRow(0);
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
function queryStatueChange() {
    if (this.readyState == 4 && this.status == 200) {
		const newBody = document.createElement('tbody');
		try{
			if(!this.responseText || this.responseText == "") throw "No results";
			const result = JSON.parse(this.responseText);
			if(!result || result.length == 0) throw "No results";
			for (country in result){
				addResultRow(newBody,result[country]);
			}
   		} catch (err) {
   			setResultString("Error: " + err);
   		}
		const oldBody = document.getElementById("tblResult").tBodies[0];
		oldBody.parentNode.replaceChild(newBody,oldBody);
		//document.getElementById("result").innerHTML = (resTxt ? "" : "No results");
    }
}
function searchFunction() {
	try {
		var searchString = document.getElementById("searchText").value;
		if (searchString == "") throw "Empty search string."
		var mode = document.querySelector('input[name = "mode"]:checked').value;
		var data = JSON.stringify({"searchString": searchString, "mode": mode});
	    var xmlhttp = new XMLHttpRequest();
	    xmlhttp.onreadystatechange = queryStatueChange;
	    xmlhttp.open("POST", "http://localhost:8765/api/index.php", true);
	    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    xmlhttp.send("q="+data);
	}
	catch(err) {
		setResultString("Error searching. " + err);
	}
	return false;
}
function languageArrayToString(array){
	var langs = [];
	for (lang of array){
		langs.push(lang.name);
	}
	return langs.join(", ");
}
function addResultRow(body,country){
	var row = body.insertRow(body.length);
	row.insertCell(0).innerHTML = country.name;
	row.insertCell(1).innerHTML = country.alpha3Code;
	var img = document.createElement("img");
	img.src = country.flag;
	img.style = "width:100%;height:auto;";
	row.insertCell(2).appendChild(img);
	row.insertCell(3).innerHTML = country.region;
	row.insertCell(4).innerHTML = country.subregion;
	var cell = row.insertCell(5);
	cell.innerHTML = country.population.toLocaleString();
	cell.classList+="pop";
	row.insertCell(6).innerHTML = languageArrayToString(country.languages);
}
function appendHeaderCell(row){
	var cell = document.createElement("th");
	row.appendChild(cell);
	return cell;
}
function appendCol(table){
	var col = document.createElement("col");
	table.appendChild(col);
	return col;
}
function setResultString(string){
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