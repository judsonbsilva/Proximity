var Proximity = {};

// Position of observed elements and distance of relevance
Proximity.points = [
	// isActive, X, Y, Distance
	[true, 300, 300, 50],
	[true, 0, 0, 100]
];

Proximity.getRelevantDistances = function(pageX, pageY){
	_.forEach(Proximity.points, function( element, index){
		// Ignore inactive elements
		if( !element[0] ) return;

		var relevantDistance = element[3];

		// Pythagorean theorem
		var distance = Math.sqrt(
			Math.pow( element[1] - pageX, 2) + Math.pow( element[2] - pageY, 2)
		);

		if( distance <= relevantDistance )
			console.log( index, 1 - distance/relevantDistance );
	});
};

Proximity.handlerMouseMove = function(event){
	Proximity.getRelevantDistances(event.pageX, event.pageY);
};

Proximity.handlerScrool = function(){

};

window.addEventListener('mousemove', Proximity.handlerMouseMove);
window.addEventListener('scroll', Proximity.handlerMouseMove);