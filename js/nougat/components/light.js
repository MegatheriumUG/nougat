ng.module('nougat.components.light')
.requires('nougat.component')
.defines(function(){
	ng.Components.Light = {};
	ng.Components.Light.Ambient = ng.Component.extend('ng.Components.Light.Ambient', {
		light: null,
		init: function(color) {
			this.light = new THREE.AmbientLight(color);
		},
		addedToGame: function(game) {
			game.scene.add(this.light);
		}
	});

	ng.Components.Light.Directional = ng.Component.extend('ng.Components.Light.Directional', {
		light: null,
		init: function(color) {
			this.light = new THREE.DirectionalLight(color);
		},
		addedToGame: function(game) {
			game.scene.add(this.light);
		}
	});

	ng.Components.Light.Point = ng.Component.extend('ng.Components.Light.Point', {
		light: null,
		init: function(color, intensity, distance, position) {
			this.light = new THREE.PointLight(color, intensity, distance);
			if(position) {
				this.light.position.x = position.x;
				this.light.position.y = position.y;
				this.light.position.z = position.z;
			}
		},
		addedToGame: function(game) {
			game.scene.add(this.light);
		}
	});
});