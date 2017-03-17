var Proximity = {};

// Position of observed elements and distance of relevance
Proximity.points = [ /* isActive, X, Y, Distance */ ];

Proximity.callbackList = [ /* Callback functions */ ];
Proximity.nodes = [ /* Observed node elements */ ];

Proximity.getRelevantDistances = function(pageX, pageY){
	_.forEach(Proximity.points, function( element, index){
		// Ignore inactive elements
		if( !element[0] ) return;

		var relevantDistance = element[3];

		// Pythagorean theorem
		var distance = Math.sqrt(
			Math.pow( element[1] - pageX, 2) + Math.pow( element[2] - pageY, 2)
		);

		// If mouse is in a relevant area
		if( distance <= relevantDistance )
			Proximity._beforeCallback(index, 1 - distance/relevantDistance );
		else if ( (distance - relevantDistance) <= 10 )
			Proximity._beforeCallback(index, 0);
	});
};

Proximity._beforeCallback = function(index, percent){
	// Call callback
	( Proximity.callbackList[index] ).call( Proximity.nodes[index], percent);
};

Proximity._handlerMouseMove = function(event){
	Proximity.getRelevantDistances(event.pageX, event.pageY);
};

/**
 * @function ProximityObserve
 * @param  {HTML DOM Node}   nodeElement  HTML node element to observe
 * @param  {Number}   relevance           Cricle radio of relevance area 
 * @param  {Function} callback            Action called when mouse is in relevant area passing the percent of center distance of element
 * @return {null}
 */
Proximity.observe = function( nodeElement, relevance, callback ){
	
	if(
		!nodeElement || typeof nodeElement != 'object' ||
		!relevance || relevance.constructor != Number ||
		!callback || callback.constructor != Function
	)
		throw new Error("Proximity.observe: invalid argument");

	// Define node as active
	var points = [true];
	// Define X coordinate
	points.push( nodeElement.offsetHeight/2 + nodeElement.offsetLeft );
	// Define Y coordinate
	points.push( nodeElement.offsetWidth/2 + nodeElement.offsetTop );
	// Define relevance. 100px is default
	points.push( relevance || 100 );

	nodeElement.proximityIndex = Proximity.points.length;

	Proximity.points.push(points);
	Proximity.callbackList.push(callback);
	Proximity.nodes.push(nodeElement);
}

/**
 * @function ProximityDisable
 * @param  {HTML DOM Node} nodeElement to disable proximity mouse observer
 * @return {null}
 */
Proximity.disable = function(nodeElement){
	
	if( !nodeElement.hasOwnProperty('proximityIndex') )
		throw new Error('Proximity.disable: node element not observed');

	var index = Number(nodeElement.proximityIndex);
	// Set 'isActive' as false
	Proximity.points[index][0] = false;
};
/**
 * @function ProximityEnable
 * @param  {HTML DOM Node} nodeElement to enable proximity mouse observer
 * @return {null}
 */
Proximity.enable = function(nodeElement){	
	if( !nodeElement.hasOwnProperty('proximityIndex') )
		throw new Error('Proximity.disable: node element not observed');

	var index = Number(nodeElement.proximityIndex);
	// Set 'isActive' as true
	Proximity.points[index][0] = true;
};

// If is in browser
if( window ){
	// When mouse move
	window.addEventListener('mousemove', Proximity._handlerMouseMove);
	window.Proximity = Proximity;
}