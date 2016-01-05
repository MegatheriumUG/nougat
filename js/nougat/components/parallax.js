ng.module('nougat.components.parallax')
.requires('nougat.component')
.defines(function(){
	ng.Components.Parallax = ng.Component.extend('ng.Components.Parallax', {
		xAmount: 0.5,
		yAmount: 0.5,
		init: function(xAmount, yAmount) {
			if(!xAmount) return;
			if(!yAmount) yAmount = xAmount;
			this.xAmount = xAmount;
			this.yAmount = yAmount;
		}
	});
});