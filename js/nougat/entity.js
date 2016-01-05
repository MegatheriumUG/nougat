ng.module('nougat.entity')
.requires('nougat.component')
.defines(function() {

	var entityID = 0;

	ng.Entity = ng.Class.extend({
		id: 0,
		components: {},
		componentAdded: new ng.Signal(),
		componentRemoved: new ng.Signal(),
		nameChanged: new ng.Signal(),
		init: function(name) {
			this.id = entityID++;
			this.name = name || 'Entity' + this.id;
		},
		/**
			Add function:
			Adds a component to the entity.
			component can either be:
				- a class derived by ng.Component
				- an instance of a class derived by ng.Component
				- a function which returns either of the first two

			Example:
				add(ng.InputComponent);
				add(new ng.InputComponent());
				add(function(){return ng.InputComponent;});
				add(function(){return new ng.InputComponent();});
		**/
		add: function(propName, component) {
			if(!component) {
				component = propName;
				propName = undefined;
			}
			if(component) {
				//componentClass = ng.getClass(component);
				componentClass = component.constructor.className;

				this.components[componentClass] = component;
				if(propName) {
					this.property(propName, {
						get: function(){return component; }
					});
				}
				this.componentAdded.dispatch(this, componentClass);
				
			}
			
			return this;

		},
		remove: function(componentClass) {
			
			if(componentClass) {
				componentClass = componentClass.className;
				this.components[componentClass] = undefined;
				this.componentRemoved.dispatch(this, componentClass);
			}
		},
		get: function(componentClass) {
			if(typeof componentClass == 'string')
				return this.components[componentClass];
			else
				return this.components[componentClass.className];
		},
		has: function(componentClass) {
			if(typeof componentClass == 'string'){
				if(this.components[componentClass]) return true;
			}
			else
				if(this.components[componentClass.className]) return true;
			
			return false;
		}

	});
	ng.Entity.property('name', {
		set: function() {this.nameChanged.dispatch();}
	});
});