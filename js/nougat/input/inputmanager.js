ng.module('nougat.input.inputmanager')
.requires('nougat.input.button')
.defines(function(){
	ng.Input = ng.Input || {};

	ng.Input.InputManager = ng.Class.extend({
		buttons: {},
		add: function(keys, name, describor) {
			var button;
			if(this.buttons[name]) {
				button = this.buttons[name];
				button.add(keys);
			}else
				button = new ng.Button(keys, name);

			if(describor) {
				if(describor.up) button.up.add(describor.up);
				if(describor.down) button.down.add(describor.down);
				if(describor.pressed) button.pressed.add(describor.pressed);
				if(describor.released) button.released.add(describor.released);
			}
			this.buttons[name] = button;
			return button;
		},
		get: function(name) { return this.buttons[name]; },
		remove: function(name) {
			var button = this.buttons[name];
			delete this.buttons[name];
			return button;
		},
		update: function() {
			for(var button in this.buttons)
				button.update();
		}
	});
});