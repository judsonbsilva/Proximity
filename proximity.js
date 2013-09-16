/*	Proximity - by: Judson Silva */

(function($,undefined){

	var rCssValue = /([0-9.-]+)([a-z%]+)/ig,
		digits = /[0-9.]+/g,
		specials = {};
	
	if( $.browser.webkit ){
		specials.transform = "-webkit-transform";
	}
	else if( $.browser.moz ){
		specials.transform = "MozTransform";
	}
	else if( $.browser.opera ){
		specials.transform = "OTransform";
	}
	else if( $.browser.ie ){
		specials.transform = "-ms-transform"
	};

	function getOffset(el,inf){

		var offleft = ( el.offset() ).left,
			offtop = ( el.offset() ).top,
			width = ( el[0] ).offsetWidth,
			height = ( el[0] ).offsetHeight;

		return { 
			width: width,
			height: height,
			left: offleft - inf,
			right: width + offleft + inf ,
			top: offtop - inf,
			bottom: offtop + height + inf
		};
	};

	function getOld(node, props){
		
		var newold = {};
		
		$.each(props,function( key,val ){
			var oldvalue = '';
			if( key in specials ) key = specials[key];
			if ( node.style[key] && digits.test( node.style[key] ) ) oldvalue = node.style[key];
			else if ( digits.test( $(node).css(key) ) ) oldvalue = $(node).css(key);
			else oldvalue = '0';
			newold[ key ] = [ oldvalue,val ];
		});
		return newold;
	};

	function magic( val,p ){
		var ind = 0,
			old = val[0].match( digits ),
			val = val[1].replace(rCssValue,function(exp,num,unit){
				old[ind] = old[ind] || '0';
				var finalvalue = Number(old[ind]) + ( Number(num) - Number(old[ind]) ) * p;
				ind++;
				return finalvalue + unit;
			});
		return val;
	};

	var countId = 0;

	$.fn.proximity = function( fn,inf ){
		
		inf = inf ? parseFloat(inf): 50;

		var _this = this,
			autom = false,
			_window = $(window);

		if( fn.constructor == Object ){
			
			$.each(_this, function(){
				$(this).data('props', getOld( this, fn) );
			});

			fn = function(ev){
				
				var element = $(this);
					props = element.data('props');

				$.each(props, function(key,val){
					element.css(key, magic(val,ev.m) );
				});

			}; 

		} else if( fn == 'off' ){
			
			$.each(_this,function(){
				var node = $( this );
				node.each(function(){
					_window.off(
						"mousemove.proximity" + node.data( "id-prox" )
					);
				});
			});

			return _this;

		} else if ( !fn ) return _this;

		$.each( _this,function(cont){
			
			var node = $(this),
				px = 0, py = 0, countZero = 0,
				mouse = {},
				sizes = getOffset( node , inf * 2 );

			if( !node.data('id-prox') ) node.data('id-prox', countId++ );
			
			_window.on('mousemove.proximity' + node.data('id-prox'),function(ev){
						
				mouse = {
					x: ev.pageX,
					y: ev.pageY
				};

				var exp1 = mouse.x >= sizes.left && mouse.x <= sizes.right;
				var exp2 = mouse.y >= sizes.top && mouse.y <= sizes.bottom;
						
				if( exp1 && exp2 ){	
					
					px =( mouse.x - sizes.left ) / ( (sizes.right - sizes.left)/2 ) || 0;
					px = px > 1 ? 2 - px: px;
						
					py =( mouse.y - sizes.top ) / ( (sizes.bottom - sizes.top)/2 ) || 0;
					py = py > 1 ? 2 - py: py;
							
					fn.call( node[0] ,{ 
						x:px, y:py,	m: px*py
					});
					countZero = 0;

				} else {
					if( countZero < 3){
						fn.call( node[0] ,{ 
							x:0, y:0,  m:0
						});
						countZero++;
					};
				};
				return null;
			});
		});

		var countScroll = 0,
			alter = function(ev){
				countScroll = countScroll == 10 ? 0: countScroll + 1;
				countScroll = ev.type == 'resize' ? 5: countScroll;
				if( countScroll == 5 ){
					$(_this).proximity('off').proximity( fn, inf );
				};
			};

		_window.scroll(alter).resize(alter);

		return _this;
	};
	
})(jQuery);