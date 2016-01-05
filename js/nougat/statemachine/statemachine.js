ng.module('nougat.statemachine.statemachine')
.requires('nougat.statemachine.state')
.defines(function(){
	ng.StateMachine = ng.Class.extend('ng.StateMachine', {
		states: {},
		stack: [],
		_chain: [],
		currentState: null,
		previousState: null,
		debug: false,
		init: function() {
		},
		addState: function(state) {
			this.states[state.name] = state;
			state.stateMachine = this;
			return state;
		},
		add: function(name) {
			return this.addState(new ng.State(name));
		},
		peek: function() {
			if(this.stack.length == 0) return null;
			return this.stack[this.stack.length-1];
		},
		change: function(name) {
			var state = this.states[name];
			if(!state) throw 'State' + name + ' does not exist';
			this.changeState(state);
		},
		changeState: function(state) {
			if(this.currentState && this.currentState.active && this.currentState.atomar) {
				this.chainState(state);
			}else{
				this.exit();
				this.pushState(state);
			}
		},
		chain: function(name) {
			var state = this.states[name];
			if(!state) throw 'State ' + name + ' does not exist';
			this.chainState(state);
		},
		chainState: function(state) {
			this._chain.push(state);
		},
		exit: function() {
			for(var i = this.stack.length-1; i >= 0; --i)
				this.pop();
		},
		push: function(name) {
			this.pushState(this.states[name]);
		},
		pushState: function(state) {
			if(!state) throw 'State ' + name + ' does not exist';
			this.stack.push(state);
			this._enterState(state);
		},
		pop: function() {
			var state = this.stack.pop();
			if(state)
				this._exitState(state);
		},
		update: function() {
			var state;
			for(var i = this.stack.length-1; i >= 0; --i) {
				state = this.stack[i];
				if(!state) return;
				//state.duration = Some Timer Stuff
				if(!state.update()) return;
			}
		},
		return: function() {
			this.changeState(this.previousState);
		},
		_enterState: function(state) {
			if(state) {
				this.currentState = state;
				state.active = true;
				//set Start Timer
				state.enter();
			}
		},
		_exitState: function(state) {
			if(state) {
				this.previousState = state;
				state.exit();
				//set Exit Timer
				state.active = false;
			}
			if(this._chain.length > 0) {
				state = this._chain.shift();
				this.pushState(state);
			}
		}
	});
});