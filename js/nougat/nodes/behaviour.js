ng.module('nougat.nodes.behaviour')
.requires('nougat.node', 'nougat.components.behaviour')
.defines(function() {
	ng.Nodes.Behaviour = ng.Node.extend('nougat.nodes.behaviour', {
		init: function() {
			this.add(ng.Components.Behaviour);
		}
	});
});