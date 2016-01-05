ng.module('nougat.input.button')
.defines(function(){
	ng.Button = ng.Class.extend({
		name: '',
		keys: [],
		//clickCount: 0,
		up: new ng.Signal(),
		down: new ng.Signal(),
		pressed: new ng.Signal(),
		released: new ng.Signal(),
		//clicked: new ng.Signal(),
		_down: false,
		init: function(keys, name) {
			this.name = name || '';
			if(keys) this.add(keys);
		},
		add: function(keys) {
			if(typeof keys == 'Array')
				for(var i = 0; i < keys.count; i++) this.add(keys[i]);
			else
				if(!this.keys.contains(key)) this.keys.push(key);
		},
		update: function() {
			var pressed = false;
			for(var key in this.keys) {
				if(ng.Keyboard.pressed(key)) {
					pressed = true;
					break;
				}
			}

			if(pressed) {
				this.down.dispatch();

				if(!this._down)
					this.pressed.dispatch();

				this._down = true;
			}else{
				this.up.dispatch();

				if(this._down)
					this.released.dispatch();

				this._down = false;
			}
		}
	});
})