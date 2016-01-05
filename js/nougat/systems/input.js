ng.module('nougat.systems.input')
.requires('nougat.components.input')
.defines(function(){
	ng.Systems.Input = ng.System.extend({
		init: function() {
			this.entities = this.engine.getEntities(ng.Nodes.Input);
		},
		update: function() {
			for(var entity in this.entities) {
				entity.get('input').update();
			}
		}
	});
});