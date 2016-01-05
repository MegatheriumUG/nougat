ng.module('nougat.entities.sprite')
.requires('nougat.entity',
'nougat.components.position',
'nougat.components.texture',
'nougat.components.material',
'nougat.components.mesh',
'nougat.components.animator',
'nougat.components.update')
.defines(function(){

	ng.Entities.Sprite = ng.Entity.extend({
		init: function(textureFile, scale, color) {
			this.parent();
			this.property('scale', {
				get: function() { return this._scale; },
				set: function(value) {
					this._scale = value;
					this.mesh.mesh.scale.x = this.size.x * this._scale.x;
					this.mesh.mesh.scale.y = this.size.y * this._scale.y;
				} 
			});
			this._scale = scale ? new ng.Vector2(scale, scale) : new ng.Vector2(1, 1);
			this
			.add('pos', new ng.Components.Position())
			.add('texture', new ng.Components.Texture(THREE.ImageUtils.loadTexture(textureFile, undefined, this.loaded.bind(this))))
			.add('color', new ng.Components.Color(color || new ng.Color()))
			.add('material', new ng.Components.Shader(
				'shader/vertex/pixelated.vs',
				'shader/fragment/pixelated.fs',
				{
					texSampler: {type: 't', value: this.texture.texture },
					size: {type: 'v2', value: new ng.Vector2() },
					repeat: {type: 'v2', value: new ng.Vector2(1, 1) },
					offset: {type: 'v2', value: new ng.Vector2(0, 0) },
					color: {type: 'v4', value: new ng.Vector4(this.color.r, this.color.g, this.color.b, this.color.a) },
					opacity: {type: 'f', value: 1}	
				}
			))
			
			//.add('material', new ng.Components.Material(new THREE.MeshBasicMaterial({map: this.texture.texture, transparent: true})))
			.add('geometry', new ng.Components.Geometry(new THREE.PlaneBufferGeometry(1, 1, 1, 1)))
			.add('mesh', new ng.Components.Mesh(new THREE.Mesh(this.geometry.geometry, this.material.material)))
			this.pos.position = this.mesh.mesh.position;

			this.color.valueChanged.add(function(){
				this.material.uniforms.color.value = new ng.Vector4(this.color.r, this.color.g, this.color.b, this.color.a);
			}, this);
			//this.texture.texture.preMultiplyAlpha = true;
			//this.texture.texture.magFilter = THREE.NearestFilter;
		},
		loaded: function() {
			var img = this.texture.texture.image;
			this.add('size', new ng.Components.Size2(img.width, img.height));
			if(this.material.uniforms) this.material.uniforms.size.value = this.size.size;
			this.scale = this._scale;
			//this.mesh.mesh.scale.x = img.width * this.scale;
			//this.mesh.mesh.scale.y = img.height * this.scale;

			//Fix transparency
			/*
			var shader = new THREE.ShaderMaterial({
				vertexShader: ng.Loader.get('shader/vertex/default.vs'),
				fragmentShader: ng.Loader.get('shader/fragment/fixTransparency.fs'),
				uniforms: {
					size: {type: 'v2', value: new ng.Vector2(img.width, img.height)},
					texSampler: {type: 't', value: this.texture.texture}
				},
				attributes: {},
				transparent: true
			});
			/*
			var shader = new THREE.MeshBasicMaterial({map: this.texture.texture});
			var tex = new THREE.WebGLRenderTarget(img.width, img.height, {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat});
			var plane = new THREE.PlaneGeometry(img.width, img.height);
			var quad = new THREE.Mesh(plane, shader);

			var scene = new THREE.Scene();
			scene.add(quad);
			var renderer = new THREE.WebGLRenderer();
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(img.width, img.height);
			renderer.autoClear = false;
			document.body.appendChild(renderer.domElement);

			var camera = new THREE.OrthographicCamera( img.width / -2, img.width / 2, img.height / 2, img.height / -2, -500, 1000);
			camera.position.z = 100;
			camera.lookAt(new ng.Vector3(0, 0, 0));

			renderer.render(scene, camera, tex, true);

			this.texture.texture = tex;
			*/
		}
	});

	ng.Entities.AnimatedSprite = ng.Entities.Sprite.extend({
		init: function(textureFile, horizTiles, vertTiles, numTiles, scale) {
			this.horizTiles = horizTiles;
			this.vertTiles = vertTiles;
			this.numTiles = numTiles;
			this.parent(textureFile, scale);
			this
			.add('animator', new ng.Components.Animator(this.texture.texture, horizTiles, vertTiles, numTiles))
			.add('update', new ng.Components.Update(function(){
				this.animator.animator.update();
				this.material.uniforms.offset.value = this.texture.texture.offset;
			}.bind(this)));
			this.material.uniforms.repeat.value = this.texture.texture.repeat;
		},
		loaded: function() {
			this.parent();

			var width = this.size.size.x / this.horizTiles;
			var height = this.size.size.y / this.vertTiles;

			this.size.size.set(width, height);
			this.scale = this._scale;
		}
	})
})