ng.module('nougat.components.texture')
.requires('nougat.component')
.defines(function(){
	ng.Components.Texture = ng.Component.extend('ng.Components.Texture', {
		texture: null,
		init: function(texture) {
			if(typeof texture == "string")
				this.texture = THREE.ImageUtils.loadTexture(texture);
			else
				this.texture = texture;
		}
	});
});