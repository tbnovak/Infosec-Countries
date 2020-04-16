//Write your javascript here, or roll your own. It's up to you.
//Make your ajax call to http://localhost:8765/api/index.php here
function searchFunction() {
	var searchString = document.getElementById("searchText").value;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
   			document.getElementById("result").innerHTML=this.responseText;
        }
    };
    xmlhttp.open("GET", "http://localhost:8765/api/index.php?q=" + searchString, true);
    xmlhttp.send();
	return false;
}