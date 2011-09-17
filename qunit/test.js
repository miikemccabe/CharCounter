
// For blagging that the chrome object exists		
		var chrome = { extension : new Object() };
		chrome.extension.sendRequest = function(){};
		

/*************************************************************
*	CharDisplay module
*************************************************************/


module("CharDisplay", {
	setup: function() {
		var div = document.createElement("div");
		var input = document.createElement("input");
		input.id = "testInput";
		div.appendChild(input);
		this.counter = new CharDisplay(input, 10);
		this.counter.createDisplay();
	}
});

////////// Tests

test("init()", function() {
	this.counter.deactivate();
	this.counter.init();
	ok(this.counter.display, "A display should be created");
});

test("createDisplay()", function() {
	this.counter.deactivate();
	equal(this.counter.display, undefined, "Just deactivated, display should be undefined");
	this.counter.createDisplay();
});

test("setDirection()", function() {
	this.counter.setDirection();
	equal(this.counter.direction, "countUp", "null");
	this.counter.setDirection("countup");
	equal(this.counter.direction, "countUp", "countup");
	this.counter.setDirection("countDown");
	equal(this.counter.direction, "countDown", "countDown");
	var currentDirection = this.counter.direction;
	this.counter.setDirection(5);
	equal(this.counter.direction, currentDirection, "5");
});

test("toggleDirection", function() {
	this.counter.setDirection("countUp");
	this.counter.toggleDirection();
	equal(this.counter.direction, "countDown");
	this.counter.toggleDirection();
	equal(this.counter.direction, "countUp");
});

test("setLimit()", function() {
	this.counter.setLimit();
	equal(this.counter.limit, 0, "null");
	this.counter.setLimit(-3);
	equal(this.counter.limit, 0, "-3");
	this.counter.setLimit(10);
	equal(this.counter.limit, 10, "10");
});



test("getId()", function() {
	equal(this.counter.input.id, this.counter.getId(), "getId() should equal CharDisplay.input.id");
});

test("deactivate", function() {
	this.counter.deactivate();
	equal(this.counter.div, undefined);
});

test("charOrChars()", function() {

	this.counter.init();
	equal(this.counter.limit, 0, "limit should be 0");
	this.counter.input.value = "Hello";
	equal(this.counter.input.value.length, 5, "the inputs length should be 5");
	equal(this.counter.charOrChars(), "chars");
	
	this.counter.input.value = "a";
	equal(this.counter.input.value.length, 1, "the inputs length should be 1");
	
	equal(this.counter.charOrChars(), "char");
	
	this.counter.setLimit(5);
	equal(this.counter.limit, 5, "set the limit to 5");
	
	this.counter.setDirection("countDown");
	equal(this.counter.direction, "countDown", "set the direction to 'countDown'");
	
	equal(this.counter.charOrChars(), "chars");
	
	this.counter.input.value = "Hell";
	
	equal(this.counter.charOrChars(), "char");
	
});



/*************************************************************
*	DisplayManager module
*************************************************************/


module("DisplayManager", {
	setup: function() {
		this.subjects = [], i=0;
		
		while(i < 5) {
			var div = document.createElement("div");
			var input = document.createElement("input");
			input.id = "testInput_"+i;
			div.appendChild(input);
			var counter = new CharDisplay(input, 10);
			counter.init();
			this.subjects.push(counter);
			i++;
		}
	}
});

////////// Tests

test("check setup ran ok", function() {
	equal(this.subjects.length, 5, "check the number of subjects");
	ok(DisplayManager, "DisplayManager exists");
	equal(DisplayManager.length(), 0, "DisplayManager has no subjects");
});

test("register()", function() {
	console.log("register()");
	ok(DisplayManager.register(this.subjects[0]), "Register 1 subject");
	equal(DisplayManager.length(), 1, "length should be 1");
	ok(DisplayManager.register(this.subjects[1]), "Register another subject");
	equal(DisplayManager.length(), 2, "length should be 2");
	ok(!DisplayManager.register(this.subjects[1]), "Register the same subject");
	equal(DisplayManager.length(), 2, "length should still be 2");
	ok(!DisplayManager.register(this.subjects[9]), "Register a non-existent subject, should fail gracefully");
	equal(DisplayManager.length(), 2, "length should still be 2");
	ok(!DisplayManager.register("Random String"), "Register a string as the subject, should fail gracefully");
	equal(DisplayManager.length(), 2, "length should still be 2");
});

test("unregister()", function() {
	console.log("unregister()");
	for(var i=0; i<this.subjects.length; i++) {
		DisplayManager.register(this.subjects[i]);
	}
	equal(DisplayManager.length(), 5, "Registered 5 subjects");
	
	ok(DisplayManager.unregister(this.subjects[0].getId()), "unregister the first subject");
	equal(DisplayManager.length(), 4, "length should be 4");
	
	ok(!DisplayManager.unregister(), "unregister with no arguments");
	equal(DisplayManager.length(), 4, "length should still be 4");
	
	ok(!DisplayManager.unregister("Random String"), "try to unregister a string");
	
	for(var i=0; i<this.subjects.length; i++) {
		DisplayManager.unregister(this.subjects[i].getId());
	}
	
	equal(DisplayManager.length(), 0, "unregistered all subjects");

});

test("broadcast()", function() {
	console.log("broadcast()");
	for(var i=0; i<this.subjects.length; i++) {
		DisplayManager.register(this.subjects[i]);
	}
	equal(DisplayManager.length(), 5, "Registered 5 subjects");
	
	ok(DisplayManager.getSubjectById("testInput_0").display, "Check the first subject has a display");
	
	ok(DisplayManager.broadcast("deactivate"), "broadcast message 'deactivate'");
	
	var display = "Should be undefined";
	
	for(var i=0; i<DisplayManager.length(); i++) {
		subject = DisplayManager.getSubjectById("testInput_"+i);
		display = subject.display;
		if(display === undefined) {
			break;
		}
	}
	
	equal(display, undefined, "display should be undefined");
	
	ok(DisplayManager.broadcast("init"), "tell all subjects to initialise");
	
	ok(DisplayManager.getSubjectById("testInput_0").display, "Check the first subject has a display again");
	
	ok(!DisplayManager.broadcast(), "broadcast an empty message");
	
	ok(!DisplayManager.broadcast("doesntExist"), "broadcast a message the subjects don't understand");
	
});

test("sendMessageToId()", function() {
	console.log("sendMessageToId()");
	
	for(var i=0; i<this.subjects.length; i++) {
		DisplayManager.unregister(this.subjects[i].getId());
	}
	
	for(var i=0; i<this.subjects.length; i++) {
		DisplayManager.register(this.subjects[i]);
	}
	
	equal(DisplayManager.length(), 5, "Registered 5 subjects");
	
	var firstSubjectDisplay = DisplayManager.getSubjectById("testInput_0").display;
	
	console.log(firstSubjectDisplay);
	
	ok(firstSubjectDisplay, "Check the first subject has a display");
	
	var id = "testInput_4";
	
	ok(DisplayManager.sendMessageToId(id, "deactivate"), "send message 'deactivate' to "+id);
	
	subject = DisplayManager.getSubjectById(id);
	
	equal(subject.display, undefined, id + " display should be undefined");
	
	ok(DisplayManager.getSubjectById("testInput_0").display, "testInput_0's display should be ok");
	
});

