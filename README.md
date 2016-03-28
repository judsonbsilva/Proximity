Proximity
=========

A new mouse event to you use with this jquery plugin! know when the mouse is near

## Installation

npm package

```sh
	npm install -g bower
```
or bower component

```sh
	bower install proximity --save
```

## Example

You can see a demo here:
[http://judsonbsilva.github.io/Proximity/](http://judsonbsilva.github.io/Proximity/)

```javascript
	$('#node').proximity(function( info ){
		console.log( info.m * 100 + '%');
	});
```