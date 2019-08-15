var butt = 'ON';

document.addEventListener("DOMContentLoaded", function(event) {
   document.getElementById("switch").innerHTML = butt;

});


function Toggle() {
	content = String(document.getElementById("switch").innerHTML);
	if(content=='ON'){
		document.getElementById("switch").innerHTML = "OFF";
		butt = "OFF";
	}
	if(content=='OFF'){
		document.getElementById("switch").innerHTML = "ON";
		butt = "ON";
	}
	console.log('popup '+butt)
	chrome.runtime.sendMessage(butt);
}

window.addEventListener('load', function load(event){
    var Button = document.getElementById('switch');
    Button.addEventListener('click', function() { Toggle(); });
});