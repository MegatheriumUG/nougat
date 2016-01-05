ng.module('nougat.components.position')
.requires('nougat.component')
.defines(function(){

ng.Components.Position = ng.Component.extend('ng.Components.Position', {
	_position: new ng.Vector3(0, 0, 0),
	init: function(x, y, z) {
		if(x instanceof ng.Vector3) {
			x = x.x;
			y = x.y;
			z = x.z;
		}

		this.property('x', {
			get: function() { return this._position.x; },
			set: function(value) { this._position.x = value; }
		});

		this.property('y', {
			get: function() { return this._position.y; },
			set: function(value) { this._position.y = value; }
		});

		this.property('z', {
			get: function() { return this._position.z; },
			set: function(value) { this._position.z = value; }
		});

		this.property('position', {
			get: function() { return this._position; },
			set: function(value) { this._position = value; }
		});

		this.x = x;
		this.y = y;
		this.z = z;
	}
});
ng.Components.Position.name = 'position';

});