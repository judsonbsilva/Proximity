/*	Proximity - by: Judson Silva */

(function($,undefined){

	var points = [],
		indexElement = 0;

	/*  Recebe Page ( X, Y) do mouse, Offset ( left, top ), Offset ( right, bottom )
		Retorna o percentual  */
	function getPercent( a, b, c ){
		/*  ( pageX - OffsetLeft ) / ( OffsetRight - OffsetLeft ) / 2 */
		var tmp = ( a - b ) / ( ( c - b) / 2 ) || 0;
		return tmp > 1 ? 2 - tmp: tmp;
	}
	/*  Recebe o elemento e área de influcência
		Retorna objeto com offsets
	  */
	function getOffset( node , influence ){

		var offleft = ( node.offset() ).left,
			offtop = ( node.offset() ).top,
			width = ( node[0] ).offsetWidth,
			height = ( node[0] ).offsetHeight;

		return {
			left: offleft - influence,
			right: width + offleft + influence ,
			top: offtop - influence,
			bottom: offtop + height + influence
		};
	};

	$.fn.proximity = function( fn , options ){

		var _this = this,
			_window = $(window);

		options = options ? options : 50;
		
		if( fn.constructor == Object ){
			fn = function(a){ console.log(a) }
		}

		$.each( _this, function(){
		
			var element = $(this),
				position = getOffset( element , options * 2 );

			if( fn == 'off' ){
				var index = element.data('proximity-index');
					element.removeData('proximity-index');
				delete points[index];
				return;
			}

			position.callback = fn;
			position.node = this;

			points[indexElement] = position;

			element.data('proximity-index', indexElement);
			indexElement++;
		});

		_window.on('mousemove', function( event ){
			points.forEach(function( point ){
				//Se estiver no campo de influencia deste elemento
				if(	event.pageX >= point.left && event.pageY >= point.top &&
					event.pageX <= point.right && event.pageY <= point.bottom ){
					
					var px = getPercent( event.pageX, point.left, point.right ),
						py = getPercent( event.pageY, point.top, point.bottom );

					point.callback.call( point.node , { x: px, y:py, m: px*py });
				} else point.callback.call( point.node , { x: 0, y: 0, m: 0});
			});
		});
		
		//Mudas os points dos elemento ao rolar a barra, ou redimensionar
		function changeOffset(){
			points.forEach(function( point, index ){
				points[point.element.index] = $.extend( point, getOffset( point.element ) ); 
			});
		}

		_window.scroll(changeOffset);
		_window.resize(changeOffset);

		return _this;
	};
	
})(jQuery);