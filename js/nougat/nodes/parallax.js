ng.module('nougat.nodes.parallax')
.requires('nougat.node', 'nougat.components.parallax', 'nougat.components.position')
.defines(function(){
	ng.Nodes.Parallax = ng.Node.extend('nougat.Nodes.Parallax', {
		init: function(){
			this.add(ng.Components.Position)
				.add(ng.Components.Parallax);
		}
	});
});