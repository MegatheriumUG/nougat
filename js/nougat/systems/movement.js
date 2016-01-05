ng.module('nougat.systems.movement')
.requires('ash')
.defines(function(){

ng.Systems.Movement = ng.Ash.System.extend({
	nodeList: null,
	init: function() {},
	addToEngine: function(engine) {
		this.nodeList = engine.getNodeList(ng.Nodes.Movement);
	},
	removeFromEngine: function(engine) {
		this.nodeList = null;
	},
	update: function() {
		for(var node = this.nodeList.head; node; node = node.next) {
			this.updateNode(node);
		}
	},

	updateNode: function() {
		var position = node.position;
		var motion = node.motion;
		position.position.add(motion.velocity * ng.Time.delta);
	}
});

});