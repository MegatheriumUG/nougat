ng.module('nougat.nodes.object')
.requires('nougat.node', 'nougat.components.position', 'nougat.components.size' )
.defines(function(){
ng.Nodes.Object = ng.Node.extend({
	init: function() {
		this.add(ng.Components.Position)
			.add(ng.Components.Size);
	}
});
});