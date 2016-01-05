ng.module('nougat.components.geometry')
.requires('nougat.component')
.defines(function(){
	ng.Components.Geometry = ng.Component.extend('ng.Components.Geometry', {
		geometry: null,
		init: function(geometry) {
			this.geometry = geometry;
		}
	});
});