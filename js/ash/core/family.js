/**
 * Ash-js Family
 */
ng.module('ash.core.family')
.requires('ash.framework')
.defines(function (Class) {
    'use strict';

    ng.Ash.Family = ng.Class.extend({
        nodes: null,
        
        init: function (nodeObject, engine) {
            this.property('nodeList', {
                get: function() {
                    return this.nodes;
                }
            });
        },

        newEntity: function (entity) {
            throw new Error( 'should be overriden' );
        },

        removeEntity: function (entity) {
            throw new Error( 'should be overriden' );
        },

        componentAddedToEntity: function (entity, componentClass) {
            throw new Error( 'should be overriden' );
        },

        componentRemovedFromEntity: function (entity, componentClass) {
            throw new Error( 'should be overriden' );
        },

        cleanUp: function () {
            throw new Error( 'should be overriden' );
        }
    });
});
