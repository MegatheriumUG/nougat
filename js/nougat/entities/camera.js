ng.module('nougat.entities.camera')
.requires('nougat.entity', 'nougat.components.position', 'nougat.components.update')
.defines(function() {
	ng.Camera = ng.Entity.extend({
		camera: null,
		previousPosition: null,
		init: function(camera) {
			this.camera = camera;
			this.previousPosition = camera.position.clone();
			this.delta = new ng.Vector3();
			this.add('pos', new ng.Components.Position())
				.add(new ng.Components.Behaviour(function() {
					this.delta.subVectors(this.pos.position, this.previousPosition);
					this.previousPosition = this.pos.position.clone();
				}, this));
			this.pos.position = camera.position;

		},

	});
});