ng.module('nougat.entities.light')
.requires('nougat.components.light')
.defines(function() {

	ng.Entities.Light = {};

	ng.Entities.Light.Ambient = ng.Entity.extend({
		init: function(color) {
			this.parent();
			this.name = 'Light' + this.id;
			this.add('light', new ng.Components.Light.Ambient(color));
		}
	});

	ng.Entities.Light.Directional = ng.Entity.extend({
		init: function(color) {
			this.parent();
			this.name = 'Light' + this.id;
			this.add('light', new ng.Components.Light.Directional(color));
		}
	});

	ng.Entities.Light.Point = ng.Entity.extend({
		init: function(color, position) {
			this.parent();
			this.name = 'Light' + this.id;
			this
			.add('pos', new ng.Components.Position())
			.add('light', new ng.Components.Light.Point(color, position));
			this.pos.position = this.light.position;
		}
	})
})