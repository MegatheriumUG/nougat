ng.module('nougat.components.mesh')
.requires('nougat.component')
.defines(function() {
	ng.Components.Mesh = ng.Component.extend('ng.Components.Mesh', {
		mesh: null,
		init: function(mesh) {
			this.mesh = mesh;
		},
		addedToGame: function(game) {
			game.scene.add(this.mesh);
		}
	});
})