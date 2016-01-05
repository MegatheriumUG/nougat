ng.module('nougat.components.color')
.requires('nougat.component')
.defines(function(){
	ng.Components.Color = ng.Component.extend('ng.Components.Color', {
		_color: null,
		init: function(color) {
			this.property('color', {
				get: function() { return this._color; },
				set: function(value) {
					var old = this._color;
					this._color = value;
					this.valueChanged.dispatch(value, old);
				}
			});
			if(color instanceof ng.Color)
				this.color = color;
			else
				this.color = new ng.Color(color);

			this.property('r', {
				get: function() { return this.color.r; },
				set: function(value) {
					var old = this.color.r;
					this.color.r = value;
					this.valueChanged.dispatch(value, old);
				}
			});
			this.property('g', {
				get: function() { return this.color.g; },
				set: function(value) {
					var old = this.color.g;
					this.color.g = value;
					this.valueChanged.dispatch(value, old);
				}
			});
			this.property('b', {
				get: function() { return this.color.b; },
				set: function(value) {
					var old = this.color.b;
					this.color.b = value;
					this.valueChanged.dispatch(value, old);
				}
			});
			this.property('a', {
				get: function() { return this.color.a; },
				set: function(value) {
					var old = this.color.a;
					this.color.a = value;
					this.valueChanged.dispatch(value, old);
				}
			});

		},
		valueChanged: new ng.Signal()
	});
});