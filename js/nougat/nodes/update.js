ng.module('nougat.nodes.update')
.requires('nougat.node', 'nougat.components.update')
.defines(function(){
	ng.Nodes.Update = ng.Node.extend('ng.Nodes.Update', {
		init: function(){
			this.add(ng.Components.Update);
		}
	});
});