var DisplayManager = (function() {
	
	var subjects = [];
	
	var register = function(subject) {
		var numberOfSubjects = subjects.length;
		
		if(subject instanceof CharDisplay) {
			for(var i=0; i<numberOfSubjects; i++) {
				if(subject.getId() === subjects[i].getId()) {
					console.log(subject.getId() + " has already been registered");
					return false;
				}
			}
			subjects.push(subject);
			return true;
		} else {
			return false;
		}
	};
	

	var unregister = function(id) {
		var numberOfSubjects = subjects.length;
		for(var i=0; i<numberOfSubjects; i++) {
			if(id === subjects[i].getId()) {
				return subjects.splice(i, 1);
			} else {
				return false;
			}
		}
	};
	
	var sendMessage = function(message, args) {
		var messageUnderstood = false;
		if(!message) {
			return false;
		}
		var numberOfSubjects = subjects.length;
		for(var i=0; i<numberOfSubjects; i++) {
			if(subjects[i][message]) {
				messageUnderstood = true;
				if(args) {
					subjects[i][message](args);
				} else {
					subjects[i][message]();
				}
			}
		}
		return messageUnderstood;
	};
	
	var sendMessageToId = function(id, message, args) {
		var numberOfSubjects = subjects.length;
		for(var i=0; i<numberOfSubjects; i++) {
			if(subjects[i].getId() === id) {
				if(args) {
					subjects[i][message](args);
					return true;
				} else {
					subjects[i][message]();
					return true;
				}
			}
		}
		return false;
	};
	
	var getSubjectById = function(id) {
		var numberOfSubjects = subjects.length;
		var subject = false;
		for(var i=0; i<numberOfSubjects; i++) {
			if(id === subjects[i].getId()) {
				subject = subjects[i];
			}
		}
		return subject;
	};
	
	var length = function() {
		return subjects.length;
	};
	
	return {
		"length" : length,
		"register" : register,
		"unregister" : unregister,
		"broadcast" : sendMessage,
		"sendMessageToId" : sendMessageToId,
		"getSubjectById" : getSubjectById
	};
	
})();