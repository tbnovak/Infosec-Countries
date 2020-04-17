//Write your javascript here, or roll your own. It's up to you.
//Make your ajax call to http://localhost:8765/api/index.php here
function searchFunction() {
	var searchString = document.getElementById("searchText").value;
	var data = JSON.stringify({"searchString": searchString});
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
   			//document.getElementById("result").innerHTML=this.responseText;
   			var result = JSON.parse(this.responseText);
   			//document.getElementById("result").innerHTML = result.result[0] + result.result[1] + result.result[2]
			document.getElementById("result").innerHTML = result.name;
        }
    };
    xmlhttp.open("POST", "http://localhost:8765/api/index.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("q="+data);
	return false;
}