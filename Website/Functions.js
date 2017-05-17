var x = 1;
var appliances = []
var timestamps = {} //Dict with inner arrays for each appliance "[Timestamp, turned on or off]"
var everything = []
var first = true;
var now = new Date();
var time = now.getTime();
var expireTime = time + 1000*36000;
now.setTime(expireTime);

loadFromCookie()
loadFromStorage()

if(timestamps === null){
	timestamps = {}
}

function changeText2(){
	var list = document.getElementById('applianceList');
	var text = document.getElementById('textField').value;

	if(text === ""){
		return
	}

	var entry = document.createElement('li');
	var button = document.createElement('button');
	entry.setAttribute('id', x)
	entry.appendChild(document.createTextNode(text + ""));
	list.appendChild(entry);
	initializeEntry(text)
	var r = $('<input class = delete id = "button' + x + '" type = "button" value = "X" onclick = "deleteButton(' + x + ', button' + x + ')"/>');
	var s = $('<input class = "state first" id = "button' + x + 'On" type = "button" value = "On" onclick = "timeStamp(1, ' + x + ')"/>');
	var t = $('<input class = state id = "button' + x + 'Off" type = "button" value = "Off" onclick = "timeStamp(0, ' + x + ')"/>');
	var timeObj = $('<div class = time id="timer' + x + '"></div>')
	eval("window.bool" + x + " = true")
	$("#" + x).append(s, t, r, timeObj);
	appliances.push(text);

	if (first === true){
		$("#div1").show();
	}
	document.cookie = appliances + "; expires = " + now.toGMTString()
	x += 1;
	first = false;
 }

 function toggleList() {
    var list = document.getElementById("applianceList");
    var header = document.getElementById("applianceText");
    var button = document.getElementById("hideButton")

    if (list.style.display == "none"){
        list.style.display = "block";
        header.style.display = "block"
        $('#hideButton').attr('value', 'Hide Appliances');

    }else{
        list.style.display = "none";
        header.style.display = "none";
        $('#hideButton').attr('value', 'Show Appliances');
    }
}

$('document').ready(function(){
	$('#textField').keypress(function(e){
		if(e.which == 13){
			$('#enterAppliance').click()
			$('#textField').val('')
		}
	})
})

function test(){
	alert(appliances + " " + JSON.stringify(timestamps))
	//apiProcess(httpGet())
}

function deleteButton(entry){
	var tmpText = $('#' + entry).text()
	tmpText = tmpText.split("On for")[0]
	var index = appliances.indexOf(tmpText);
	document.cookie = appliances + "; expires = " + now.toGMTString()
	$("#" + entry).remove(); //since the other buttons are tied to the entry, this deletes everything. Useful
	if(index > -1){
		appliances.splice(index, 1)
	}
	document.cookie = appliances + "; expires = " + now.toGMTString()
}

function loadFromCookie(){
	appliances = (document.cookie).split(',');
	if(JSON.stringify(appliances).includes("\"\"")){
		appliances.splice(0,1)
	}
	var list = document.getElementById('applianceList');
	for(i = 0; i < appliances.length; i ++){
		var entry = document.createElement('li')
		var button = document.createElement('button')
		entry.setAttribute('id', i + 1)
		entry.appendChild(document.createTextNode(appliances[i]));
		list.appendChild(entry);
		initializeEntry(appliances[i])
		var r = $('<input class = delete id = "button' + (i+1) + '" type = "button" value = "X" onclick = "deleteButton(' + (i+1) + ', button' + (i+1) + ')"/>');
		var s = $('<input class = "state first" id = "button' + (i+1) + 'On" type = "button" value = "On" onclick = "timeStamp(1, ' + (i+1) + ')"/>');
		var t = $('<input class = state id = "button' + (i+1) + 'Off" type = "button" value = "Off" onclick = "timeStamp(0, ' + (i+1) + ')"/>');		
		var timeObj = $('<div class = time id="timer' + (i+1) + '"></div>')
		eval("window.bool" + (i+1) + " = true")
		$("#" + (i+1)).append(s, t, r, timeObj);
	}
	x = appliances.length + 1
}

function timeStamp(bool, identifier){
	var applianceName = $('#' + identifier).text();
	applianceName = applianceName.split("On for")[0]
	var dt = Date.now();
	if (bool == 1){
		eval("bool" + identifier + " = true")
		startTimer(identifier)
	}
	else{
		document.getElementById('timer' + identifier).style.visibility="hidden"
		eval("bool" + identifier + " = false")
	}
	timestamps[applianceName].push([dt, bool])
	storeLocally()

}

function startTimer(identifier) {
	var div = document.getElementById('timer' + identifier);
	document.getElementById('timer' + identifier).style.visibility="visible"
    var start = Date.now()
    function timer(alreadyOn) {
    	if(eval("window.bool" + identifier + "=== false")){
    		clearInterval(interval)
    	}
    	milliseconds = ((Date.now() - start))
    	seconds = Math.floor((milliseconds/1000) % 60)
    	minutes = Math.floor((milliseconds/(1000 * 60)) % 60)
    	hours = Math.floor((milliseconds/(1000 * 60 * 60)) % 60)
    	if(hours < 1.0){
    		div.textContent = "On for: " + minutes + ":" + seconds
    		if(seconds < 10){
    			div.textContent = "On for: " + minutes + ":0" + seconds
    		}
    		else{
   	    		div.textContent = "On for: " + minutes + ":" + seconds
    		}
    	}
    	else{
    		if(seconds < 10){
    			if(minutes < 10){
    				div.textContent = "On for: " + hours + ":0" + minutes + ":0" + seconds
    			}
    			else{
    				div.textContent = "On for: " + hours + ":" + minutes + ":0" + seconds
    			}
    		}
    		if(minutes < 10){
    			div.textContent = "On for: " + hours + ":0" + minutes + ":" + seconds
    		}
    		else{
    			div.textContent = "On for: " + hours + ":" + minutes + ":" + seconds
    		}
    	}
    };
    timer();
    var interval = setInterval(timer, 100);
}

function initializeEntry(key){
	if(!(key in timestamps)){
		timestamps[key] = []
	}
}
function storeLocally(){
	localStorage.setItem('appliances', JSON.stringify(appliances))
	localStorage.setItem('timestamps', JSON.stringify(timestamps))
}

function loadFromStorage(){
	timestamps = JSON.parse(localStorage.getItem("timestamps"))
}
function clearAll(){
	if(confirm("Are you sure you want to clear all your Appliances?")){
		for(i = 0; i < x; i ++){
			$("#" + i).remove();
		}
		appliances = []
		x = 1
	}
	else{
		return
	}
}

function httpGet(){
	var dt = Math.floor(Date.now()/1000)
	baseURL = "https://api.eyedro.com/e2?"
	UserKey = "vostro3ryV2x4jhewPhLN6UQRtxZ35vXqGamTauq"
	cmd = "VostroEnergy.GetData"
	dateStart = dt - (7.5 * 60)
	dateStop = dt
	fullURL = baseURL + "UserKey=" + UserKey + "&Cmd=" + cmd + "&DateStartSecUtc=" + dateStart + "&DateStopSecUtc=" + dateStop;
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", fullURL, false);
	xmlHttp.send(null);
	return xmlHttp.responseText;
}

function apiProcess(input){
	inputDict = JSON.parse(input)
	alert(input)
	alert(inputDict.Data["004006EE"][0][1])
}
