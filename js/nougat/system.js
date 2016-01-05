ng.module('nougat.system')
.requires('nougat.entity')
.defines(function(){
	ng.System = ng.Class.extend({
		priority: 0,
		engine: null,
		addedToEngine: function(engine){},
		removedFromEngine: function(engine){},
		update: function(){}
	});
});