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
function searchFunction() {
	var searchString = document.getElementById("searchText").value;
	var mode = document.querySelector('input[name = "mode"]:checked').value;
	var data = JSON.stringify({"searchString": searchString, "mode": mode});
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
   			var resTxt = "";
			var newBody = document.createElement('tbody');
        	if(this.responseText && this.responseText != ""){
	   			var result = JSON.parse(this.responseText);
	   			for (country in result){
	   				resTxt+=result[country].name+"<br>";
	   				addRow(newBody,result[country]);
	   			}
   			}
   			var oldBody = document.getElementById("tblResult").tBodies[0];
   			oldBody.parentNode.replaceChild(newBody,oldBody);
   			document.getElementById("result").innerHTML = (resTxt ? "" : "No results");
        }
    };
    xmlhttp.open("POST", "http://localhost:8765/api/index.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("q="+data);
	return false;
}
function languageArrayToString(array){
	var langs = [];
	for (lang of array){
		langs.push(lang.name);
	}
	return langs.join(", ");
}
function addRow(body,country){
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