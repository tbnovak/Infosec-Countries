//Write your javascript here, or roll your own. It's up to you.
//Make your ajax call to http://localhost:8765/api/index.php here
function searchFunction() {
	var searchString = document.getElementById("searchText").value;
	var mode = document.querySelector('input[name = "mode"]:checked').value;
	var data = JSON.stringify({"searchString": searchString, "mode": mode});
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
   			var resTxt="";
        	if(this.responseText && this.responseText != ""){
	   			var result = JSON.parse(this.responseText);
	   			for (country in result){
	   				resTxt+=result[country].name+"<br>";
	   			}
	   		}else{
	   			resTxt = "No results";
	   		}
   			document.getElementById("result").innerHTML = resTxt;
        }
    };
    xmlhttp.open("POST", "http://localhost:8765/api/index.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("q="+data);
	return false;
}