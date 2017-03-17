'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Proximity = {};

// Position of observed elements and distance of relevance
Proximity._points = [/* isActive, X, Y, Distance */];
Proximity._callbackList = [/* Callback functions */];
Proximity._nodes = [/* Observed node elements */];

Proximity._getRelevantDistances = function (pageX, pageY) {

	_.forEach(Proximity._points, function (element, index) {
		// Ignore inactive elements
		if (!element[0]) return;

		var relevantDistance = element[3];

		// Pythagorean theorem
		var distance = Math.sqrt(Math.pow(element[1] - pageX, 2) + Math.pow(element[2] - pageY, 2));

		// If mouse is in a relevant area
		if (distance <= relevantDistance) Proximity._beforeCallback(index, 1 - distance / relevantDistance);else if (distance - relevantDistance <= 10) Proximity._beforeCallback(index, 0);
	});
};

Proximity._beforeCallback = function (index, percent) {
	// Call callback
	Proximity._callbackList[index].call(Proximity._nodes[index], percent);
};

Proximity._handlerMouseMove = function (event) {
	Proximity._getRelevantDistances(event.pageX, event.pageY);
};

Proximity._active = function () {
	window.addEventListener('mousemove', Proximity._handlerMouseMove);
};

/**
 * @function ProximityObserve
 * @param  {HTML DOM Node}   nodeElement  HTML node element to observe
 * @param  {Number}   relevance           Cricle radio of relevance area 
 * @param  {Function} callback            Action called when mouse is in relevant area passing the percent of center distance of element
 * @return {null}
 */
Proximity.observe = function (nodeElement, relevance, callback) {

	if (!nodeElement || (typeof nodeElement === 'undefined' ? 'undefined' : _typeof(nodeElement)) != 'object' || !relevance || relevance.constructor != Number || !callback || callback.constructor != Function) throw new Error("Proximity.observe: invalid argument");

	// Define node as active
	var points = [true];
	// Define X coordinate
	points.push(nodeElement.offsetHeight / 2 + nodeElement.offsetLeft);
	// Define Y coordinate
	points.push(nodeElement.offsetWidth / 2 + nodeElement.offsetTop);
	// Define relevance. 100px is default
	points.push(relevance || 100);

	nodeElement.proximityIndex = Proximity._points.length;

	Proximity._points.push(points);
	Proximity._callbackList.push(callback);
	Proximity._nodes.push(nodeElement);
};

/**
 * @function ProximityDisable
 * @param  {HTML DOM Node} nodeElement to disable proximity mouse observer
 * @return {null}
 */
Proximity.disable = function (nodeElement) {

	if (!nodeElement.hasOwnProperty('proximityIndex')) throw new Error('Proximity.disable: node element not observed');

	var index = Number(nodeElement.proximityIndex);
	// Set 'isActive' as false
	Proximity._points[index][0] = false;
};
/**
 * @function ProximityEnable
 * @param  {HTML DOM Node} nodeElement to enable proximity mouse observer
 * @return {null}
 */
Proximity.enable = function (nodeElement) {
	if (!nodeElement.hasOwnProperty('proximityIndex')) throw new Error('Proximity.disable: node element not observed');

	var index = Number(nodeElement.proximityIndex);
	// Set 'isActive' as true
	Proximity._points[index][0] = true;
};

// If is in browser
if (window) {
	Proximity._active();
	window.Proximity = Proximity;
}
'use strict';

jQuery.fn.proximity = function (fn, relevance) {
	_.forEach(this, function (nodeElement) {
		if (fn == 'disable') Proximity.disable(nodeElement);else if (fn == 'enable') Proximity.enable(nodeElement);else Proximity.observe(nodeElement, relevance || 100, fn);
	});
};