ng.module('nougat.node')
.requires('nougat.component')
.defines(function(){
	ng.Node = ng.Class.extend({
		components: [],
		add: function(componentClass){
			if(this.components.contains(componentClass))
				throw 'Component of the class "' + componentClass + '" is already in the list.';
			this.components.push(componentClass);
			return this;	
		},
		remove: function(componentClass) {
			if(!this.components.contains(componentClass))
				throw 'Component "' + componentClass + '" is not in the list and cannot be removed.';
			this.components.remove(componentClass);
			return this;
		}
	})
});