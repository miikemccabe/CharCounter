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
		var subject = false;
		for(var i=0; i<numberOfSubjects; i++) {
			if(id === subjects[i].getId()) {
				subject = subjects[i];
			}
		}
		return subject;
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