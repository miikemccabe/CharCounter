var DisplayManager = (function() {
	
	var subjects = [];
	
	var register = function(subject) {
		var numberOfSubjects = subjects.length;
		for(var i=0; i<numberOfSubjects; i++) {
			if(subject.getId() === subjects[i].getId()) {
				console.log(subject.getId() + " has already been registered");
				return false;
			}
		}
		subjects.push(subject);
	};
	

	var unregister = function(id) {
		var numberOfSubjects = subjects.length;
		for(var i=0; i<numberOfSubjects; i++) {
			if(id === subjects[i].getId()) {
				return subjects.splice(i, 1);
			}
		}
	};
	
	var sendMessage = function(message, args) {
		var numberOfSubjects = subjects.length;
		for(var i=0; i<numberOfSubjects; i++) {
			if(args) {
				subjects[i][message](args);
			} else {
				subjects[i][message]();
			}
		}
	};
	
	var sendMessageToId = function(id, message, args) {
		var numberOfSubjects = subjects.length;
		for(var i=0; i<numberOfSubjects; i++) {
			if(subjects[i].getId() === id) {
				if(args) {
					subjects[i][message](args);
				} else {
					subjects[i][message]();
				}
			}
		}
	};
	
	var getSubjectById = function(id) {
		var numberOfSubjects = subjects.length;
		for(var i=0; i<numberOfSubjects; i++) {
			if(id === subjects[i].getId()) {
				return subjects[i];
			}
		}
	};
	
	return {
		"length" : subjects.length,
		"register" : register,
		"unregister" : unregister,
		"broadcast" : sendMessage,
		"sendMessageToId" : sendMessageToId,
		"getSubjectById" : getSubjectById
	};
	
})();



/**
*	Add the styles
*
*/

var head = document.getElementsByTagName("head")[0];

var style = document.createElement("link");
style.href = chrome.extension.getURL("charCountStyles.css");
style.type = "text/css";
style.rel = "stylesheet";

head.appendChild(style);


/**
*	Char Counter Objects
*
*/

var CharDisplay = function(input, max) {
	this.input = input;
	this.maxChars = max;
	this.direction = "countUp";
	this.originalBackgroundColor = this.input.style.backgroundColor;
	
	this.div = document.createElement("div");
	this.div.setAttribute("class", "charCounter");
	this.input.parentNode.appendChild(this.div);
	
	var that = this;
	
	var toggleDirection = function() {
		console.log(that);
		that.direction = that.direction === "countUp" ? "countDown" : "countUp";	
		that.update();
		chrome.extension.sendRequest({
			"method" : "updateCharCounter",
			"id" : that.input.id,
			"state" : { 
				"direction" : that.direction,
				"limit" : that.maxChars
			}});
	}
	
	this.div.addEventListener("click", toggleDirection);
	
}
	
CharDisplay.prototype.init = function(direction) {
	this.direction = direction;
}

CharDisplay.prototype.update = function() {
	if(this.direction === "countDown") {	
		this.div.innerHTML = (this.maxChars - this.input.value.length) + " chars left";	
	} else {
		this.div.innerHTML = this.input.value.length + " chars";	
	}
	if(this.input.value.length > this.maxChars) {
		this.input.style.backgroundColor = "#faa";
	} else {
		this.input.style.backgroundColor = this.originalBackgroundColor;
	}
}	

CharDisplay.prototype.getId = function() {
	return this.input.id;
}

CharDisplay.prototype.deactivate = function() {
	this.input.style.backgroundColor = this.originalBackgroundColor;
	this.div.parentNode.removeChild(this.div);
}


	







/**
*	The business logic
*
*/

var lastClickedElement;


/**
* Add event listeners
*
*/


addEventListener("keyup", function() {
	DisplayManager.broadcast("update");
});

addEventListener("contextmenu", function(e) {
	lastClickedElement = e.target;
});




/**
*	Communicating with localStorage
*
*/



// Check local storage for previously added Char Counters
chrome.extension.sendRequest({method: "getLocalStorage"}, function(localStorage){
	if(localStorage !== null) {
		for(var key in localStorage) {
			if(document.getElementById(key)) {
				var obj = JSON.parse(localStorage[key]);
				var charCounter = new CharDisplay(document.getElementById(key), obj.limit);
				charCounter.direction = obj.direction;
				DisplayManager.register(charCounter);
				DisplayManager.broadcast("update");
			}
		}
	}
});

function addCharCounter() {
	var charLimit = prompt("What is the maximum number of chars this field should hold?");
	
	var charDisplay = new CharDisplay(lastClickedElement, charLimit);
	DisplayManager.register(charDisplay);
	DisplayManager.broadcast("update");
	
	return {
		"direction" : "up", 
		"limit" : charLimit 
	};
	
}

function removeCharCounter() {
	
	var id = lastClickedElement.id;
	
	DisplayManager.sendMessageToId(id, "deactivate");
	
	DisplayManager.unregister(id);
	
	DisplayManager.broadcast("update");

}


chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

	if(request.method === "addCharCounter") {
		
		var state = addCharCounter();
		
		sendResponse({"id" : lastClickedElement.id, "state" : state });
		
	} else if(request.method === "removeCharCounter") {
	
		removeCharCounter();	
		sendResponse({"id" : lastClickedElement.id });
		
	} else {
	
		sendResponse({});
		
	}
});

