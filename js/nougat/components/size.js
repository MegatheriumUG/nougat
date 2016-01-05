ng.module('nougat.components.size')
.requires('nougat.component')
.defines(function(){

	ng.Components.Size2 = ng.Component.extend('ng.Components.Size2', {
		size: new ng.Vector2(0, 0),
		init: function(width, height) {
			if(width instanceof ng.Vector2) {
				height = width.y;
				width = width.x;
			}
			this.size.x = width;
			this.size.y = height;

			this.property('x', {
			get: function() { return this.size.x; },
			set: function(value) { this.size.x = value; }
		});

		this.property('y', {
			get: function() { return this.size.y; },
			set: function(value) { this.size.y = value; }
		});
		}
	})

ng.Components.Size = ng.Component.extend('ng.Components.Size', {
	size: new ng.Vector3(0, 0, 0),
	init: function(width, height, depth) {

		this.property('x', {
			get: function() { return this.size.x; },
			set: function(value) { this.size.x = value; }
		});

		this.property('y', {
			get: function() { return this.size.y; },
			set: function(value) { this.size.y = value; }
		});

		this.property('z', {
			get: function() { return this.size.z; },
			set: function(value) { this.size.z = value; }
		});

		this.x = width;
		this.y = height;
		this.z = depth;
	}

});
ng.Components.Size.name = 'size';

});