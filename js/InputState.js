// THREEx.InputState.js keep the current state of the keyboard.
// It is possible to query it at any time. No need of an event.
// This is particularly convenient in loop driven case, like in
// 3D demos or games.
//
// # Usage
//
// **Step 1**: Create the object
//
// ```var keyboard	= new THREEx.InputState();```
//
// **Step 2**: Query the keyboard state
//
// This will return true if shift and A are pressed, false otherwise
//
// ```keyboard.pressed("shift+A")```
//
// **Step 3**: Stop listening to the keyboard
//
// ```keyboard.destroy()```
//
// NOTE: this library may be nice as standaline. independant from three.js
// - rename it keyboardForGame
//
// # Code
//

/** @namespace */
var THREEx	= THREEx 		|| {};

/**
 * - NOTE: it would be quite easy to push event-driven too
 *   - microevent.js for events handling
 *   - in this._onkeyChange, generate a string from the DOM event
 *   - use this as event name
*/
THREEx.InputState	= function()
{
	// to store the current state
	this.keyCodes	= {};
	this.modifiers	= {};
	this.mouseCodes = {};
	this.mouse = {
		x: 0,
		y: 0
	};
	
	// create callback to bind/unbind keyboard events
	var self	= this;
	this._onKeyDown	= function(event){ self._onKeyChange(event, true); };
	this._onKeyUp	= function(event){ self._onKeyChange(event, false);};

	this._onMouseDown = function(event){ self._onMouseChange(event, true); };
	this._onMouseUp   = function(event){ self._onMouseChange(event, false); };

	this._onMouseMove = function(event){
		var canvas = document.getElementsByTagName('canvas')[0];
		if(canvas){
			var rect = canvas.getBoundingClientRect();
			self.mouse.x = event.clientX - rect.left;
			self.mouse.y = event.clientY - rect.top;
		}else{
			self.mouse.x = event.clientX;
			self.mouse.y = event.clientY;
		}
	};

	// bind keyEvents
	document.addEventListener("keydown", this._onKeyDown, false);
	document.addEventListener("keyup", this._onKeyUp, false);

	document.addEventListener("mousedown", this._onMouseDown, false);
	document.addEventListener("mouseup", this._onMouseUp, false);
	document.addEventListener("mousemove", this._onMouseMove, false);
}

/**
 * To stop listening of the keyboard events
*/
THREEx.InputState.prototype.destroy	= function()
{
	// unbind keyEvents
	document.removeEventListener("keydown", this._onKeyDown, false);
	document.removeEventListener("keyup", this._onKeyUp, false);

	document.removeEventListener("mousedown", this._onMouseDown, false);
	document.removeEventListener("mouseup", this._onMouseUp, false);
	document.removeEventListener("mousemove", this._onMouseMove, false);
}

THREEx.InputState.MODIFIERS	= ['shift', 'ctrl', 'alt', 'meta'];
THREEx.InputState.ALIAS	= {
	'left'		: 37,
	'up'		: 38,
	'right'		: 39,
	'down'		: 40,
	'space'		: 32,
	'pageup'	: 33,
	'pagedown'	: 34,
	'tab'		: 9
};

THREEx.InputState.MOUSEALIAS = {
	'mouseleft'		: 0,
	'mousemiddle'	: 1,
	'mouseright'	: 2
};

/**
 * to process the keyboard dom event
*/
THREEx.InputState.prototype._onKeyChange	= function(event, pressed)
{
	// log to debug
	//console.log("onKeyChange", event, pressed, event.keyCode, event.shiftKey, event.ctrlKey, event.altKey, event.metaKey)

	// update this.keyCodes
	var keyCode		= event.keyCode;
	this.keyCodes[keyCode]	= pressed;

	// update this.modifiers
	this.modifiers['shift']= event.shiftKey;
	this.modifiers['ctrl']	= event.ctrlKey;
	this.modifiers['alt']	= event.altKey;
	this.modifiers['meta']	= event.metaKey;
}

THREEx.InputState.prototype._onMouseChange = function(event, pressed) {
	var button = event.button;
	this.mouseCodes[button] = pressed;
}

/**
 * query keyboard state to know if a key is pressed of not
 *
 * @param {String} keyDesc the description of the key. format : modifiers+key e.g shift+A
 * @returns {Boolean} true if the key is pressed, false otherwise
*/
THREEx.InputState.prototype.pressed	= function(keyDesc)
{
	var keys	= keyDesc.split("+");
	for(var i = 0; i < keys.length; i++){
		var key		= keys[i];
		var pressed;
		if( THREEx.InputState.MODIFIERS.indexOf( key ) !== -1 ){
			pressed	= this.modifiers[key];
		}else if( Object.keys(THREEx.InputState.ALIAS).indexOf( key ) != -1 ){
			pressed	= this.keyCodes[ THREEx.InputState.ALIAS[key] ];
		}else if (Object.keys(THREEx.InputState.MOUSEALIAS).indexOf(key) != -1){
			pressed = this.mouseCodes[THREEx.InputState.MOUSEALIAS[key] ];
		}else {
			pressed	= this.keyCodes[key.toUpperCase().charCodeAt(0)]
		}
		if( !pressed)	return false;
	};
	return true;
}
