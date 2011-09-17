var CharDisplay = function(input) {
	this.input = input;
	this.limit;
	this.direction;
	this.originalBackgroundColor = this.input.style.backgroundColor;
	this.display;	
}

CharDisplay.prototype.init = function(direction, limit) {
	this.setDirection(direction);
	this.setLimit(limit);
	this.createDisplay();
}

CharDisplay.prototype.createDisplay = function() {
	this.display = document.createElement("div");
	this.display.setAttribute("class", "charCounter");
	this.display.setAttribute("title", "Click to toggle between counting up and counting down");
	this.input.parentNode.appendChild(this.display);
	
	this.display.addEventListener("mouseover", this.displayLimit.bind(this));
	this.display.addEventListener("mouseout", this.update.bind(this));
	
	if(this.limit > 0) {	
		this.display.addEventListener("click", this.toggleDirection.bind(this));
	}
}

CharDisplay.prototype.setDirection = function(direction) {
	var currentDirection = this.direction;
	if(direction === "countUp" || direction === "countDown") {
		this.direction = direction;
	} else {
		this.direction = currentDirection || "countUp";
	}
}

CharDisplay.prototype.toggleDirection = function() {
	this.direction = this.direction === "countUp" ? "countDown" : "countUp";	
	this.update();
	chrome.extension.sendRequest({
		"method" : "updateCharCounter",
		"id" : this.input.id,
		"state" : { 
			"direction" : this.direction,
			"limit" : this.limit
		}});
}

CharDisplay.prototype.displayLimit = function() {
	if(this.limit > 0) {
		this.display.innerHTML = this.limit + " chars allowed";
	} else {
		this.display.innerHTML = "Unlimited chars allowed";
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
	var charOrChars = this.charOrChars();
	
	if(this.limit === 0) {
		this.display.innerHTML = this.input.value.length + " " + charOrChars;
		return;
	} else {
		if(this.direction === "countDown") {
			this.display.innerHTML = (this.limit - this.input.value.length) + " " + charOrChars + " left";
		} else {
			this.display.innerHTML = this.input.value.length + " " + charOrChars;		
		}
	}
	
	if(this.input.value.length > this.limit) {
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

CharDisplay.prototype.charOrChars = function() {
	var length;
	
	if(this.limit === 0 || this.direction === "countUp") {
		length = this.input.value.length;
	} else {
		length = (this.limit - this.input.value.length);
	}
	return length === 1 ? "char" : "chars";	
}



