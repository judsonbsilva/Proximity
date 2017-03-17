jQuery.fn.proximity = function(fn , relevance){		
	_.forEach( this, function(nodeElement){
		if( fn == 'disable' )
			Proximity.disable(nodeElement);
		else if( fn == 'enable')
			Proximity.enable(nodeElement);
		else 
			Proximity.observe(nodeElement, relevance || 100, fn);
	});
};