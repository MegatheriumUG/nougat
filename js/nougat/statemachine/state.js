ng.module('nougat.statemachine.state')
.defines(function(){
	ng.State = ng.Class.extend('ng.State', {
		name: '',
		stateMachine: null,
		active: false,
		atomar: false,
		init: function(name) {
			this.name = name;
			this.property('enter', {
				get: function() { return function() { this._enter.dispatch(); }; },
				set: function(value) { this._enter.add(value, this); }
			});
			this.property('update', {
				get: function() { return function() { this._update.dispatch(); }; },
				set: function(value) { this._update.add(value, this); }
			});
			this.property('exit', {
				get: function() { return function() { this._exit.dispatch(); }; },
				set: function(value) { this._exit.add(value, this); }
			});
		},
		_enter: new ng.Signal(),
		_update: new ng.Signal(),
		_exit: new ng.Signal(),
		change: function(name) {
			return this.statemachine.change(name);
		},
		push: function(name) {
			return this.statemachine.push(name);
		},
		pop: function(resume) {
			this.stateMachine.pop();
			return (typeof resume == 'boolean') ? resume : true;
		}
	})
});