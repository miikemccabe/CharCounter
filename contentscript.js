

var lastClickedElement;


/**
* Event listeners
*
*/


addEventListener("contextmenu", function(e) {
	lastClickedElement = e.target;
});


addEventListener("keyup", function() {
	DisplayManager.broadcast("update");
});


chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

	if(request.method === "addCharCounter") {
		
		var state = CharCounterFactory.create();
		
		if(state !== false) {
			sendResponse({"id" : lastClickedElement.id, "state" : state });
		} else {
			sendResponse({});
		}
		
	} else if(request.method === "removeCharCounter") {
	
		CharCounterFactory.remove(lastClickedElement.id);	
		sendResponse({"id" : lastClickedElement.id });
		
	} else {
	
		sendResponse({});
		
	}
});

var CharCounterFactory = (function() {

	var create = function() {
		// If there is already a char counter don't create a new one
		if(DisplayManager.getSubjectById(lastClickedElement.id)) {
			return false;
		}
	
		var charLimit = prompt("What is the maximum number of chars this field should hold?");
		
		var charDisplay = new CharDisplay(lastClickedElement);
		charDisplay.init("countUp", charLimit);
		
		DisplayManager.register(charDisplay);
		DisplayManager.broadcast("update");
	
		return getState(charDisplay);
	};

	var createFromObject = function(id, obj) {
		var charDisplay = new CharDisplay(document.getElementById(id));
		charDisplay.init(obj.direction, obj.limit);
		DisplayManager.register(charDisplay);
		DisplayManager.broadcast("update");
	
		return getState(charDisplay);
	};
	
	var remove = function(id) {
	
		DisplayManager.sendMessageToId(id, "deactivate");
		
		DisplayManager.unregister(id);
		
		DisplayManager.broadcast("update");
	
	};
	
	var getState = function(counter) {
		return {
			"direction" : counter.direction,
			"limit" : counter.limit
		}
	}
	
	return {
		"create" : create,
		"createFromObject" : createFromObject,
		"remove" : remove
	}
})();




// Check local storage for previously added Char Counters and recreate them
chrome.extension.sendRequest({method: "getLocalStorage"}, function(localStorage){
	if(localStorage !== null) {
		for(var key in localStorage) {
			if(document.getElementById(key)) {
				var obj = JSON.parse(localStorage[key]);
				CharCounterFactory.createFromObject(key, obj);
			}
		}
	}
});




