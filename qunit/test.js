
module("Char Counter", {
	setup: function() {
		var div = document.createElement("div");
		var input = document.createElement("input");
		input.id = "testInput";
		div.appendChild(input);
		this.counter = new CharDisplay(input, 10);
		this.counter.createDisplay();
	}
});

test("init()", function() {
	this.counter.deactivate();
	this.counter.init();
	ok(this.counter.display, "A display should be created");
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
