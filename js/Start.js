ng.module('game.main')
.requires('nougat.game')
.defines(function() {

var game = new ng.Game();
game.add(new ng.Systems.Parallax());
game.add(new ng.Systems.Behaviour());

var backgrounds = [];
//backgrounds.push(new ng.Entities.Sprite('img/checkpattern.png', 4));

backgrounds.push(new ng.Entities.Sprite('img/back06.png', 1));
backgrounds.push(new ng.Entities.Sprite('img/back05.png', 1));
backgrounds.push(new ng.Entities.Sprite('img/back04.png', 1));
backgrounds.push(new ng.Entities.Sprite('img/back03.png', 1));
backgrounds.push(new ng.Entities.Sprite('img/back02.png', 1));
backgrounds.push(new ng.Entities.Sprite('img/back01.png', 1));



backgrounds.for(function(background, i) {
	background.pos.position.z = -i - 1;
	background.add(new ng.Components.Parallax(10));
	game.add(background);
});

var temple = new ng.Entities.Sprite('img/temple.png', 1);
var foreground = new ng.Entities.Sprite('img/foreground.png', 1);
foreground.add(new ng.Components.Parallax(10));
foreground.pos.z = 4;
game.add(temple);
game.add(foreground);

var parrots = [];
var parrot = new ng.Entities.Parrot();
parrot.pos.x = -50;
parrot.pos.y = 32;
parrots.push(parrot);
var bar = new ng.Entities.Bar(new ng.Vector3(-66, 32, 0), new ng.Vector2(18, 1));
parrot.bar = bar;
parrot = new ng.Entities.Parrot();
parrot.pos.x = -145;
parrot.pos.y = -64;
parrot.color.color = new ng.Color(1.1, 1.1, 1.1);

parrots.push(parrot);
bar = new ng.Entities.Bar(new ng.Vector3(-160, -64, 0), new ng.Vector2(20, 1));
parrot.bar = bar;


parrots.for(function(parrot){
	game.add(parrot);
});
game.cam.pos.y = 0;
game.cam.pos.z = 10;
game.cam.camera.lookAt(new ng.Vector3(0, 0, 0));
game.cam.camera.zoom = 3.4;
game.cam.camera.updateProjectionMatrix();

var cameraShake = new ng.Entity();
cameraShake.add(new ng.Components.Behaviour(function() {
	game.cam.pos.x = ng.Random.perlin(ng.Time.total * 0.2) * 50 + ng.Random.perlin(ng.Time.total * 2) * 2 - 25;
	//game.cam.pos.x = Math.sin(ng.Time.total * 0.2) * 50;
	//game.cam.pos.y = ng.Random.perlin(ng.Time.total * 0.3 + 17) * 40 + ng.Random.perlin(ng.Time.total * 2 + 12) * 2 - 20;
	game.cam.camera.zoom = 3.4 + ng.Random.perlin(ng.Time.total * 0.1 + 10) * 0.5;
	game.cam.camera.updateProjectionMatrix();
}));

game.add(cameraShake);

var rayScene = new THREE.Scene();
var rayCamera = new THREE.OrthographicCamera
( game.viewport.width / -2, game.viewport.width / 2, game.viewport.height / 2, game.viewport.height / -2,
 -1000, 1000);
rayCamera.z = 10;
rayCamera.lookAt(new ng.Vector3(0, 0, 0));
rayScene.add(rayCamera);
var rayTarget = new THREE.WebGLRenderTarget(game.viewport.width, game.viewport.height);
var rayShader = THREE.DirectionalBlur;
var rayUniforms = THREE.UniformsUtils.clone(rayShader.uniforms);
var rayMaterial = new THREE.ShaderMaterial( {
	uniforms: rayUniforms,
	vertexShader: rayShader.vertexShader,
	fragmentShader: rayShader.fragmentShader
});

var rayTex = THREE.ImageUtils.loadTexture("img/clouds.png");
var clouds = new THREE.Mesh(
	new THREE.PlaneBufferGeometry(game.viewport.width, 600),
	new THREE.MeshBasicMaterial({map: rayTex, transparent: true, alphaTest: 0.5, blending: THREE.AdditiveBlending, opacity: 0.5})
);
clouds.position.y = 300;

var clouds2 = new THREE.Mesh(
	new THREE.PlaneBufferGeometry(game.viewport.width, 600),
	new THREE.MeshBasicMaterial({map: rayTex, transparent: true, alphaTest: 0.5, blending: THREE.AdditiveBlending, opacity: 0.5})
);
clouds2.position.y = 350;

var cloudScene = new THREE.Scene();
cloudScene.add(rayCamera);
cloudScene.add(clouds);
cloudScene.add(clouds2);
var cloudTarget = new THREE.WebGLRenderTarget(game.viewport.width, game.viewport.height);
rayUniforms["map"].value = cloudTarget;

var rayQuad = new THREE.Mesh(
	new THREE.PlaneBufferGeometry(game.viewport.width, game.viewport.height),
	//new THREE.MeshBasicMaterial({map: cloudTarget}));
	rayMaterial);
rayScene.add(rayQuad);

var rayDebugQuad = new THREE.Mesh(
	new THREE.PlaneBufferGeometry(600, 400),
	new THREE.MeshBasicMaterial({
		map: rayTarget,
		transparent: true,
		alphaTest: 0.5,
		blending: THREE.AdditiveBlending,
		depthWrite: false,
		opacity: 0.5
	})
);
game.scene.add(rayDebugQuad);

var particleCount = 1000,
	particles = new THREE.Geometry(),
	pMaterial = new THREE.PointsMaterial({
		color: 0xffffff,
		size: 10.0,
		map: THREE.ImageUtils.loadTexture("img/particle.png"),
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthWrite: false,
		depthTest: true,
		opacity: 0.2,
		sizeAttenuation: false
	});

for(var p = 0; p < particleCount; p++) {
	var px = Math.random() * 600 - 300,
		py = Math.random() * 230 - 100,
		pz = Math.random() * 7 - 4;
	particles.vertices.push(new THREE.Vector3(px, py, pz));
}

var particleSystem = new THREE.Points(particles, pMaterial);
particleSystem.sortParticles = true;
game.scene.add(particleSystem);


var Spring = ng.Entity.extend({
	position: 0,
	targetPosition: 0,
	velocity: 0,
	stiffness: 0.25,
	damping: 0.015,
	update: function() {
		var x = this.position - this.targetPosition;
		var acc = -this.stiffness * x - this.velocity * this.damping;
		this.position += this.velocity * ng.Time.delta;
		this.velocity += acc;
	}
});

var Water = ng.Entity.extend({
	springs: [],
	spread: 1,
	geometry: null,
	material: null,
	mesh: null,

	init: function(n) {
		this.geometry = new THREE.Geometry();



		for(var i = 0; i < n; ++i) {
			this.springs[i] = new Spring();
			var offset = 1 / n * (Math.random() * 1.5 + 10);
			this.geometry.vertices.push(new ng.Vector3(i / n, 0, 0));
			this.geometry.vertices.push(new ng.Vector3(i / n - offset, -1, 0));

			
			if(i > 0) {
				

				var rnd = [Math.random(), Math.random(), Math.random()];

				var face = new THREE.Face3(i*2+1, i*2, i*2-1);

				face.vertexColors[0] = new THREE.Color(0.2 + rnd[0] * 0.2, 0.2 + rnd[1] * 0.2, 0.2 + rnd[2] * 0.2 );
				face.vertexColors[1] = new THREE.Color(0.2 + rnd[0] * 0.2, 0.2 + rnd[1] * 0.2, 0.2 + rnd[2] * 0.2);
				face.vertexColors[2] = new THREE.Color(0.2 + rnd[0] * 0.2, 0.2 + rnd[1] * 0.2, 0.2 + rnd[2] * 0.2);
				this.geometry.faces.push(face);

				rnd = [Math.random(), Math.random(), Math.random()];
				var intensity = Math.random() > 0.95 ? 0.5 : 0.2;

				var face = new THREE.Face3(i*2, i*2-1, i*2-2);
				
				face.vertexColors[0] = new THREE.Color(0.2 + rnd[0] * intensity, 0.2 + rnd[1] * intensity, 0.2 + rnd[2] * intensity);
				face.vertexColors[1] = new THREE.Color(0.2 + rnd[1] * intensity, 0.2 + rnd[2] * intensity, 0.2 + rnd[0] * intensity);
				face.vertexColors[2] = new THREE.Color(0.2 + rnd[2] * intensity, 0.2 + rnd[0] * intensity, 0.2 + rnd[1] * intensity);
				this.geometry.faces.push(face);

				
			}

		}
		this.material = new THREE.MeshBasicMaterial({
			color: 0x1f473a,
			side: THREE.DoubleSide,
			vertexColors: THREE.VertexColors,
			blending: THREE.AdditiveBlending,
			transparent: true
		});
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.scale.x = 600;
		this.mesh.scale.y = 80;
		this.mesh.position.x = -300;
		this.mesh.position.y = -80;
		this.mesh.position.z = 1;
		game.scene.add(this.mesh);
	},
	update: function() {

		for(var i = 0; i < this.springs.length; ++i)
			this.springs[i].update();

		leftDeltas = [];
		rightDeltas = [];
		
		for(var j = 0; j < 8; ++j) {
			for(var i = 0; i < this.springs.length; ++i) {
				if(i > 0) {
					leftDeltas[i] = this.spread * (this.springs[i].position - this.springs[i-1].position);
					this.springs[i-1].velocity += leftDeltas[i];
				}
				if(i < this.springs.length - 1) {
					rightDeltas[i] = this.spread * (this.springs[i].position - this.springs[i+1].position);
					this.springs[i+1].velocity += rightDeltas[i];
				}
			}
		}
		
		
		for(var i = 0; i < this.springs.length; ++i) {
			if( i > 0)
				this.springs[i-1].position += leftDeltas[i] * ng.Time.delta;
			if( i < this.springs.length - 1)
				this.springs[i+1].position += rightDeltas[i] * ng.Time.delta;
		}
		

		for(var i = 0; i < this.springs.length; ++i) {
			this.geometry.vertices[i*2].y = this.springs[i].position;
			this.geometry.vertices[i*2+1].x += (ng.Random.perlin(i * 5 + ng.Time.total * 5) - 0.5) / this.springs.length * 0.03;
		}
		this.geometry.verticesNeedUpdate = true;

		for(var i = 0, splashes = 10; i < splashes; ++i)
			this.splash(Math.floor(i / splashes * this.springs.length), (ng.Random.perlin(ng.Time.total * 5 + i) - 0.5) * Math.random() * 0.3);

	},
	splash: function(index, speed) {
		if(index >= 0 && index < this.springs.length)
			this.springs[index].velocity += speed;
	}
});

var water = new Water(200);


game.renderer.autoClear = true;

var render = game.render.bind(game);

game.render = function() {

	water.update();

	var p = particleCount;
	while(p--) {
		var particle = particleSystem.geometry.vertices[p];
		particle.y += (ng.Random.perlin(ng.Time.total + p) - 0.5) * ng.Time.delta * 10;
		particle.x += (ng.Random.perlin(ng.Time.total * 0.5 + 2 * p) - 0.5) * ng.Time.delta * 10;
		var offset = game.cam.delta;
		particle.lerp(new ng.Vector3(
			particle.x - offset.x * particle.z * 20,
			particle.y - offset.y * particle.z * 20,
			particle.z), 1 * ng.Time.delta);
	}
	
	particleSystem.geometry.verticesNeedUpdate = true;

	game.renderer.render(cloudScene, rayCamera, cloudTarget);

	//clouds.rotation.z = -0.25 + Math.sin(ng.Time.total * 0.3) * 0.05;
	clouds.rotation.z = -0.25 + ng.Random.perlin(ng.Time.total * 0.3) * 0.05;
	clouds2.rotation.z = -0.25 + ng.Random.perlin(ng.Time.total * 0.1 + 100) * 0.04;
	clouds.position.x = ng.Random.perlin(ng.Time.total * 0.1) * 100;
	clouds2.position.x = ng.Random.perlin(ng.Time.total * 0.17 + 7) * 100 - 30;
	clouds.material.opacity = Math.sin(ng.Time.total * 50) * 0.05 * ng.Random.perlin(ng.Time.total) + 0.55;
	clouds2.material.opacity = 0.5 + ng.Random.perlin(ng.Time.total * 0.1 + 20) * 0.3;
	rayUniforms["step"].value = new THREE.Vector2(1, 4).normalize().multiplyScalar( 0.005 );
	rayUniforms["intensity"].value = 2;
	game.renderer.render(rayScene, rayCamera, rayTarget);

	render();
	//game.renderer.render(game.scene, game.camera, cloudTarget);

	//postPass.materialBokeh.uniforms.focus.value = (Math.sin(ng.Time.total * 0.2) + 1) / 2;
	//console.log(postPass.materialBokeh.uniforms.focus.value);
	//postPass.materialBokeh.uniforms.aperture.value = (Math.sin(ng.Time.total * 1.5) + 1) * 2;
	//postPass.materialBokeh.uniforms.maxBlur
	//composer.render(0.1);
}
});


