//Write your javascript here, or roll your own. It's up to you.
//Make your ajax call to http://localhost:8765/api/index.php here
function searchFunction() {
	var searchString = document.getElementById("searchText").value;
	var data = JSON.stringify({"searchString": searchString});
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
   			document.getElementById("result").innerHTML=this.responseText;
        }
    };
    xmlhttp.open("POST", "http://localhost:8765/api/index.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("q="+data);
	return false;
}