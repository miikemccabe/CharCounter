var CharDisplay = function(input, limit) {
	this.input = input;
	this.limit = limit;
	this.direction = "countUp";
	this.originalBackgroundColor = this.input.style.backgroundColor;
	this.display;
	
	var that = this;
	
	var toggleDirection = function() {
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
	
	//this.display.addEventListener("click", toggleDirection);
	
}

CharDisplay.prototype.init = function(direction, limit) {
	this.setDirection(direction);
	this.setLimit(limit);
	this.createDisplay();
}

CharDisplay.prototype.createDisplay = function() {
	this.display = document.createElement("div");
	this.display.setAttribute("class", "charCounter");
	this.input.parentNode.appendChild(this.display);
}

CharDisplay.prototype.setDirection = function(direction) {
	var currentDirection = this.direction;
	if(direction === "countUp" || direction === "countDown") {
		this.direction = direction;
	} else {
		this.direction = currentDirection || "countUp";
	}
}

CharDisplay.prototype.setLimit = function(limit) {
	if(limit > 0) {
		this.limit = limit;
	} else {
		this.limit = 0;
	}
}

CharDisplay.prototype.update = function() {
	if(this.direction === "countDown") {	
		this.display.innerHTML = (this.maxChars - this.input.value.length) + " chars left";	
	} else {
		this.display.innerHTML = this.input.value.length + " chars";	
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
	this.display.parentNode.removeChild(this.display);
	this.display = undefined;
}