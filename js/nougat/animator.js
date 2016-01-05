ng.module('nougat.animator')
.requires('nougat.time', 'nougat.statemachine.statemachine')
.defines(function(){
	ng.Animator = ng.StateMachine.extend({
		init: function(texture, horizTiles, vertTiles, numTiles) {
			this.texture = texture;
			this.horizTiles = horizTiles;
			this.vertTiles = vertTiles;
			this.numTiles = numTiles;
			this.texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			this.texture.repeat.set(1 / this.horizTiles, 1 / this.vertTiles);
			//this.texture.magFilter = THREE.NearestFilter;
			this.animations = {};
			this.sequence = [];
			this.setTile(0);
		},
		setCoordinates: function(x, y) {
			this.texture.offset.x = (x / this.horizTiles);
			this.texture.offset.y = (this.vertTiles - 1 - y) / this.vertTiles;

		},
		setTile: function(tile) {
			var x = tile % this.horizTiles;
			var y = Math.floor(tile / this.horizTiles) % this.vertTiles;
			this.setCoordinates(x, y);
		},
		add: function(name, animation, timestep, loop) {
			if(animation instanceof Array) {
				animation = new ng.Animation(animation, timestep, loop);
			}
			this.animations[name] = animation;
			return animation;
		},
		playSequence: function(animations) {
			this.sequence = animations;
			this.sequencing = true;
			this.sequenceId = 0;
			this.play(animations[0]);
		},
		play: function(animation, forceStart) {
			if(animation) {
				if(typeof animation == 'string') animation = this.animations[animation];
				if(animation != this.animation || forceStart) {
					this.frame = 0;
					this.startTime = ng.Time.timestamp();
					this.time = 0;
					this.animation = animation;
					this.tile = this.animation.frames[0];
					this.setTile(this.tile);
					
				}
			}

			this.playing = true;
		},
		stop: function() {
			this.playing = false;
		},
		update: function() {

			if(this.playing) {

				this.time += ng.Time.step;
				while(this.time > this.animation.duration) {
					this.time -= this.animation.duration;
					this.frame = (this.frame + 1);
					if(this.frame == this.animation.frames.length) {
						if(this.sequencing) {
							this.sequenceId = (this.sequenceId + 1) % this.sequence.length;
							this.play(this.sequence[this.sequenceId]);
						}
						
						if(this.animation.looping || this.looping)
							this.frame = 0;
						else
							this.stop();
						this.animation.finish.dispatch();
					};
					this.tile = this.animation.frames[this.frame];
					this.setTile(this.tile);
				}
			}


		}
	});

	ng.Animation = ng.State.extend({
		init: function(frames, duration, looping) {
			this.frames = frames;
			this.duration = duration;
			this.looping = false || looping;
		},
		finish: new ng.Signal()
	});

	ng.Animation.Loop = ng.Animation.extend({
		init: function(numFrames, duration) {
			var frames = [];
			for(var i = 0; i < numFrames; ++i)
				frames.push(i);
			this.parent(frames, duration, true);
		}
	})
});