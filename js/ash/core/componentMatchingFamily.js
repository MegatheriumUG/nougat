/**
 * Ash-js Component matching family
 *
 */
ng.module('ash.core.componentMatchingFamily')
.requires(

    'ash.framework',
    'ash.core.family',
    'ash.core.nodePool',
    'ash.core.nodeList',
    'ash.core.dictionary'
    
)
.defines(function () {
    'use strict';

    ng.Ash.ComponentMatchingFamily = ng.Ash.Family.extend({
        init: function (nodeClass, engine) {
            this.nodeClass = nodeClass;
            this.engine = engine;
            this.property('nodeList',{
                get: function() {
                    return this.nodes;
                }
            });

            this.nodes = new ng.Ash.NodeList();
			this.entities = new ng.Ash.Dictionary();
			this.components = new ng.Ash.Dictionary();
            this.nodePool = new ng.Ash.NodePool( this.nodeClass, this.components );
			
            this.nodePool.dispose( this.nodePool.get() );

            var nodeClassPrototype = this.nodeClass.prototype;

            for(var property in nodeClassPrototype) {
                ///TODO - tidy this up...
                if(nodeClassPrototype.hasOwnProperty(property) &&
                    property != "types" &&
                    property != "next" &&
                    property != "previous" &&
                    property != "constructor" &&
                    property != "super" &&
                    property != "extend" &&
                    property != "entity") {
                    var componentObject = nodeClassPrototype.types[property];
                    this.components.add(componentObject, property);
                }
            }
        },

        newEntity: function (entity) {
            this.addIfMatch(entity);
        },

        componentAddedToEntity: function (entity, componentClass) {
            this.addIfMatch(entity);
        },

        componentRemovedFromEntity: function (entity, componentClass) {
            if (this.components.has(componentClass)) {
                this.removeIfMatch(entity);
            }
        },

        removeEntity: function (entity) {
            this.removeIfMatch(entity);
        },

        cleanUp: function () {
            for (var node = this.nodes.head; node; node = node.next) {
                this.entities.remove(node.entity);
            }
            this.nodes.removeAll();
        },

        addIfMatch: function (entity) {
            if (!this.entities.has(entity)) {
                var componentClass;
                if (
                    !this.components.forEach(function(componentClass, componentName) {
                        if(!entity.has(componentClass)) {
                            return "return";
                        }
                    })
               ) { return; }
                var node = this.nodePool.get();
                node.entity = entity;
                this.components.forEach(function (componentClass, componentName) {
                    node[componentName] = entity.get(componentClass);
                });
                this.entities.add(entity, node);
                entity.componentRemoved.add(this.componentRemovedFromEntity, this);
                this.nodes.add(node);
            }
        },

        removeIfMatch: function (entity) {
            var entities = this.entities,
                nodes = this.nodes,
                engine = this.engine,
                nodePool = this.nodePool;

            if (entities.has(entity))
            {
                var node = entities.retrieve(entity);
                entity.componentRemoved.remove(this.componentRemovedFromEntity, this);
                entities.remove(entity);
                nodes.remove(node);
                if (engine.updating) {
                    nodePool.cache(node);
                    engine.updateComplete.add(this.releaseNodePoolCache, this);
                } else {
                    nodePool.dispose(node);
                }
            }
        },

        releaseNodePoolCache: function () {
            this.engine.updateComplete.remove(this.releaseNodePoolCache);
            this.nodePool.releaseCache();
        }
    });
});
