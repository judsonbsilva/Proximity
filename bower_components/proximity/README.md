![alt text](http://judsonbsilva.github.io/Proximity/logo.png "Logo Title")

Proximity
=========

A new mouse event to you use with this lib! know when the mouse is near of an html dom element

## Installation

npm package

```sh
	npm install proximity-js --save
```
or bower component

```sh
	bower install proximity --save
```

## Example

You can see a demo here:
[http://judsonbsilva.github.io/Proximity/](http://judsonbsilva.github.io/Proximity/)


```html

<div id='myElement' class='box'>
</div>

```

```css

.box {
	float:left;
	width:100px;
	height:100px;
	margin:10px;
	text-align:center;
	background:#ddd;
}

```

```javascript

	Proximity.observe(
		document.querySelector('#myElement'), 100, function(p){
			this.style.borderRadius = ( p * 100 ) + '%';
		}
	);

```