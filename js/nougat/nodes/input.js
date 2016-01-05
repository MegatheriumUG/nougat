ng.module('nougat.nodes.input')
.requires('nougat.components.input', 'nougat.node')
.defines(function(){

	ng.Nodes.Input = ng.Node.extend({
		init: function() {
			this.add(ng.Components.Input);
		}
	});
});