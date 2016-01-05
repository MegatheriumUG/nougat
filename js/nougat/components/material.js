ng.module('nougat.components.material')
.requires('nougat.component')
.defines(function(){
	ng.Components.Material = ng.Component.extend('ng.Components.Material', {
		material: null,
		init: function(material) {
			this.material = material;
		}
	});

	ng.Components.Shader = ng.Components.Material.extend('ng.Components.Shader', {
		material: null,
		init: function(vertexShader, fragmentShader, uniforms) {
			this.material = new THREE.ShaderMaterial( {
				uniforms: uniforms,
				vertexShader: ng.Loader.get(vertexShader),
				fragmentShader: ng.Loader.get(fragmentShader),
				transparent: true,
				alphaTest: 0.5,
				blending: THREE.CustomBlending,
				blendSrc: THREE.OneFactor,
				blendDst: THREE.OneMinusSrcAlphaFactor,
				blendEquation: THREE.AddEquation

			});
			this.uniforms = this.material.uniforms;
		}
	});
});