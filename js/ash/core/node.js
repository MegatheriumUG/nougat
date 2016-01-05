/**
 * Ash-js Node
 */
ng.module('ash.core.node')
.requires('ash.framework')
.defines(function (Class) {
    'use strict';

    ng.Ash.Node = ng.Class.extend({
        entity: null,
        previous: null,
        next: null,
	
        init: function () { }
    });

    /**
    * A simpler way to create a node.
    *
    * Example: creating a node for component classes Point &amp; energy:
    *
    * var PlayerNode = Ash.Node.create({
    *   point: Point,
    *   energy: Energy
    * });
    *
    * This is the simpler version from:
    *
    * var PlayerNode = Ash.Node.extend({
    *   point: null,
    *   energy: null,
    *
    *   types: {
    *     point: Point,
    *     energy: Energy
    *   }
    * });
    */
    ng.Ash.Node.create = function (schema) {
        var processedSchema = {
            types: {},
            init: function () { }
        };

        // process schema
        for (var propertyName in schema) {
            if (schema.hasOwnProperty(propertyName)) {
                var propertyType = schema[propertyName];
                if (propertyType) {
                    processedSchema.types[propertyName] = propertyType;
                }
                processedSchema[propertyName] = null;
            }
        }

        return Node.extend(processedSchema);
    };
});
