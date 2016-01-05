ng.module('nougat.components.update')
.requires('nougat.component')
.defines(function(){
	ng.Components.Update = ng.Component.extend('ng.Components.Update', {
		updates: [],
		init: function(update, context) {
			if(update) this.add(update, context);
		},
		add: function(update, context) {
			update.context = context;
			this.updates.push(update);
		},
		update: function() {
			this.updates.for(function(update) {
				if(update.context)
					update.call(update.context);
				else
					update();
			});
		}
	});
});