ng.module('nougat.game')
.requires(
	'nougat.time',
	'nougat.engine',
	'nougat.entities',
	'nougat.systems',
	'nougat.debug',
	'nougat.animator'
)
.defines(function() {

ng.Game = ng.Class.extend({
	scene: null,
	viewport: null,
	camera: null,
	renderer: null,
	basic: null,
	objects: [],
	clock: null,
	time: null,
	engine: null,
	debug: false,

	init: function() {
		ng.game = this;
		this.engine = new ng.Engine(this);
		this.clock = new THREE.Clock(true);

		this.time = {
			delta: 0,
			total: 0,
			dt: 0,
			step: 1.0 / 60,
			acculumator: 0
		}

		this.scene = new THREE.Scene();
		this.viewport = {
			width: ng.agent.viewport.width,
			height: ng.agent.viewport.height
		};
		this.cam = new ng.Camera(
			new THREE.OrthographicCamera(
				this.viewport.width / -2, this.viewport.width / 2,
				this.viewport.height / 2, this.viewport.height / -2,
				-1000, 1000));
		
		//this.camera = new THREE.OrthographicCamera( this.viewport.width / -2, this.viewport.width / 2, this.viewport.height / 2, this.viewport.height / -2, -1000, 1000);
		this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
		this.renderer.setSize(this.viewport.width, this.viewport.height);


		this.add(new ng.Systems.Update());
		this.add(this.cam);
		

		ng.$append(this.renderer.domElement);
		this.pauseOverlay = ng.$new('div');
		this.pauseOverlay.setAttribute('id', 'pauseOverlay');
		this.pauseOverlay.css = [
			"#pauseOverlay {",
				"background-color: #000;",
				"opacity: 0.0;",
				"transition: all ease-in-out 0.3s;",
				"position: absolute;",
				"width: 100%;",
				"height: 100%;",
				"top: 0px",
			"}",
			"#pauseOverlay.visible {",
				"opacity: 0.5;",
			"}"
		].join('\n');
		var css = ng.$new('style');
		css.innerHTML = this.pauseOverlay.css;
		ng.$('head')[0].appendChild(css);
		ng.$append(this.pauseOverlay);
		ng.Canvas = ng.$('canvas');
		var self = this;
		ng.Canvas.resize = function(width, height) {
			self.viewport.width = width;
			self.viewport.height = height;
			self.cam.camera.aspect = width / height;
			self.cam.camera.left = -width / 2;
			self.cam.camera.right = width / 2;
			self.cam.camera.top = height / 2;
			self.cam.camera.bottom = -height / 2;
			self.cam.camera.updateProjectionMatrix();
			self.renderer.setSize(width, height);
		};
		window.addEventListener('resize', function() {
			ng.Canvas.resize(window.innerWidth, window.innerHeight);
		}.bind(this), false);
		this.loop();


		if(Browser.isIE) {
			window.addEventListener('focusout', function() {
				this.pause();
			}.bind(this), false);
			window.addEventListener('focusin', function() {
				//window.setTimeout(function() { this.play(); }.bind(this), 5000);
			}.bind(this), false);
		} else {
			document.addEventListener('blur', function() {
				this.pause();
			}.bind(this), false);
			document.addEventListener('focus', function() {
				//window.setTimeout(function() { this.play(); }.bind(this), 5000);
			}.bind(this), false);
			document.addEventListener('visibilitychange', function(e) {
				if(document.visibilityState == 'hidden')
					this.pause();
				else
					window.setTimeout(function() { this.play(); }.bind(this), 500);
			}.bind(this), false);
		}

	},

	loop: function() {

		ng.Time.update();

		if(this.playing) {

			this.loopUpdate();
			this.loopRender();

		}

		if(this.debug) {
			ng.Debug.setText('');
			if(!this.playing)
				ng.Debug.addText('[red] P A U S E D ! [/]');
		}

		requestAnimationFrame(this.loop.bind(this));
	},

	loopRender: function() {
		this.render();
	},

	loopUpdate: function() {
		this.time.acculumator += ng.Time.delta;
		while(this.time.acculumator >= ng.Time.step) {
			this.update();
			ng.Time.total += ng.Time.step;
			this.time.acculumator -= ng.Time.step;
		}
	},
	render: function() {
		this.renderer.render(this.scene, this.cam.camera);
	},
	update: function() {
		this.engine.update();
	},

	add: function(object) {
		if(object instanceof ng.Entity) {
			this.engine.addEntity(object);			
		}else if(object instanceof ng.System) {
			this.engine.addSystem(object);
		}else if(arguments.length > 1)
			for(var i = 1; i < arguments.length; ++i)
				this.add(arguments[i]);
	},
	playing: true,
	onPlay: new ng.Signal(),
	play: function() {
		window.setTimeout(function(){
			this.playing = true;
			this.onPlay.dispatch();
		}.bind(this), 300);
		
		this.pauseOverlay.className = this.pauseOverlay.className.replace(" visible", "");
		
	},
	onPause: new ng.Signal(),
	pause: function() {
		this.playing = false;
		this.onPause.dispatch();
		this.pauseOverlay.className += " visible";
		
	}
});	
});