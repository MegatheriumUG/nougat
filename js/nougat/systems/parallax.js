ng.module('nougat.systems.parallax')
.requires('nougat.system', 'nougat.nodes.parallax')
.defines(function(){
	ng.Systems.Parallax = ng.System.extend({
		addedToEngine: function(engine) {
			this.engine = engine;
			this.entities = engine.getEntities(ng.Nodes.Parallax);
		},
		update: function() {
			this.entities = this.engine.getEntities(ng.Nodes.Parallax);
			this.entities.for(function(entity){
				var pos = entity.get(ng.Components.Position);
				if(pos.z == 0.0) return;
				var camX = ng.game.cam.pos.x;
				var camY = ng.game.cam.pos.y;
				var camZ = ng.game.cam.pos.z;
				var parallax = entity.get(ng.Components.Parallax);
				var offset = ng.game.cam.delta;
				var smoothing = 1;
				pos.position.lerp(new ng.Vector3(pos.x - offset.x * parallax.xAmount * pos.z, pos.y - offset.y * parallax.yAmount * pos.z, pos.z), smoothing * ng.Time.delta);
				//pos.position.set(offset.x * parallax.xAmount, offset.y * parallax.yAmount, pos.z);
			});
		}
	})
});