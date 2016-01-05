ng.module('nougat.components.behaviour')
.requires('nougat.component')
.defines(function() {

ng.Components.Behaviour = ng.Component.extend('ng.Components.Behaviour', {
	_start: new ng.Signal(),
	_update: new ng.Signal(),
	_end: new ng.Signal(),
	entity: null,
	behaviours: [],
	/* behaviour = {
		start: function,
		update: function,
		end: function
	} */
	init: function(behaviour) {
		if(typeof behaviour == 'function') behaviour = {update: behaviour};
		if(behaviour) this.add(behaviour);
	},
	add: function(behaviour) {
		this.behaviours.push(behaviour);
		if(behaviour.start) this._start.add(behaviour.start);
		if(behaviour.update) this._update.add(behaviour.update);
		if(behaviour.end) this._end.add(behaviour.end);
	},
	start: function() {
		this._start.dispatch();
	},
	update: function() {
		this._update.dispatch();
	},
	end: function() {
		this._end.dispatch();
	}

});

});