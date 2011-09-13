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
	this.countOption;
	this.originalBackgroundColor = this.input.style.backgroundColor;
	
	this.div = document.createElement("div");
	this.div.setAttribute("class", "charCounter");
	this.input.parentNode.appendChild(this.div);
	
	this.init = function(countOption) {
		this.countOption = countOption;
	}
	
	this.update = function() {
	
		if(this.countOption === "countDown") {	
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
}

function Manager() {
	
	this.subjects = [];
	
	this.register = function(subject) {
		var numberOfSubjects = this.subjects.length;
		for(var i=0; i<numberOfSubjects; i++) {
			if(subject === this.subjects[i]) {
				console.log(subject.input.id + " has already been registered");
				return false;
			}
		}
		this.subjects.push(subject);
	};
	
	this.unregister = function(subject) {
		var numberOfSubjects = this.subjects.length;
		for(var i=0; i<numberOfSubjects; i++) {
			if(subject === this.subjects[i]) {
				return this.subjects.splice(i, 1);
			}
		}
	};
	
	this.sendMessage = function(message, args) {
		var numberOfSubjects = this.subjects.length;
		for(var i=0; i<numberOfSubjects; i++) {
			if(args) {
				this.subjects[i][message](args);
			} else {
				this.subjects[i][message]();
			}
		}
	}
	
}


/**
*	The business logic
*
*/

var manager = new Manager();


var nameInput = document.getElementById("ctl00_TviContent__Pages_ProductDetails_Frame_ProductForm_txt_productname");
var shortNameInput = document.getElementById("ctl00_TviContent__Pages_ProductDetails_Frame_ProductForm_txt_productshortname");
var shortDescInput = document.getElementById("ctl00_TviContent__Pages_ProductDetails_Frame_ProductForm_txt_summary");
var additionalImageInput = document.getElementById("ctl00_TviContent__Pages_Images_Frame_Gallery_txt_title");

var advancedPromoDescInput = document.getElementById("ctl00_TviContent_txt_description");



if(nameInput) {
	var nameField = new CharDisplay(nameInput, 70);
	manager.register(nameField);
}

if(shortNameInput) {
	var shortNameField = new CharDisplay(shortNameInput, 55);
	manager.register(shortNameField);
}

if(shortDescInput) {
	var shortDescField = new CharDisplay(shortDescInput, 255);
	manager.register(shortDescField);
}

if(additionalImageInput) {
	var additionalImageField = new CharDisplay(additionalImageInput, 50);
	manager.register(additionalImageField);
}

if(advancedPromoDescInput) {
	var advancedPromoDescField = new CharDisplay(advancedPromoDescInput, 81);
	manager.register(advancedPromoDescField);
}

/**
* Add onkeyup
*
*/

document.body.onkeyup = (function() { 
	return function() {
		manager.sendMessage("update");
	}
})();


/**
*	Communicating with localStorage
*
*/

chrome.extension.sendRequest({method: "localStorage", key: "count"}, function(response){
	manager.sendMessage("init", response.data);
	manager.sendMessage("update");
});