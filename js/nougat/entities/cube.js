ng.module('nougat.entities.cube')
.requires('nougat.object')
.defines(function() {
	ng.Entities.Cube = ng.Object.extend({
		init: function(game, x, y, z, size, color, name) {
			return new ng.Object(game, x, y, z, size, size, size, color, name);
		}
	});
});