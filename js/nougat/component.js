ng.module('nougat.component')
.defines(function(){
	var componentId = 0;
	ng.Component = ng.Class.extend({
		name: 'component',
		addedToGame: null
	});
});