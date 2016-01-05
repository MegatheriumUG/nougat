ng.module('nougat.components.input')
.requires('nougat.component')
.defines(function(){
	ng.Components.Input = ng.Component.extend('ng.Components.input', {
		input: new ng.Input.InputManager()
	});
	ng.Components.Input.name = 'input';
});