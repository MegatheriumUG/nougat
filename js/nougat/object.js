ng.module('nougat.object')
.requires('nougat.components', 'nougat.entity')
.defines(function(){

ng.Object = ng.Entity.extend({
	game: null,
	debugColor: '#5555cc',
	debugDraw: false,

	init: function(game, x, y, z, width, height, depth, color, name) {
		this.parent(name);
		this.game = game;

		this.add('pos', new ng.Components.Position(x, y, z))
			.add('size', new ng.Components.Size(width, height, depth))
			.add('geometry', new ng.Components.Geometry(new THREE.BoxGeometry(width, height, depth)))
			.add('color', new ng.Components.Color(color))
			.add('material', new ng.Components.Material(new THREE.MeshLambertMaterial ({color: this.color.color})))
			.add('mesh', new ng.Components.Mesh(new THREE.Mesh(this.geometry.geometry, this.material.material)));
	}
});

});