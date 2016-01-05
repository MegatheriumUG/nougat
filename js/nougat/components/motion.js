ng.module('nougat.components.velocity')
.requires('nougat.component')
.defines(function(){

ng.Components.Velocity = ng.Component.extend('ng.Components.Velocity', {
	init: function(vx, vy, vz) {
		this.velocity = new ng.Vector3(vx, vy, vz);

		this.property('x', {
			get: function() { return this.velocity.x; },
			set: function(value) { this.velocity.x = value; }
		});

		this.property('y', {
			get: function() { return this.velocity.y; },
			set: function(value) { this.velocity.y = value; }
		});

		this.property('z', {
			get: function() { return this.velocity.z; },
			set: function(value) { this.velocity.z = value; }
		});
	}
})

});