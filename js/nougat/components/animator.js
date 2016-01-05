ng.module('nougat.components.animator')
.requires('nougat.component', 'nougat.animator')
.defines(function(){
	ng.Components.Animator = ng.Component.extend('ng.Components.Animator', {
		animator: null,
		init: function(texture, horizTiles, vertTiles, numTiles) {
			this.animator = new ng.Animator(texture, horizTiles, vertTiles, numTiles);
		},
		play: function(animation) {
			this.animator.play(animation);
		}
	})
});