/**
 * Ash-js engine
 *
 */
ng.module('ash.core.engine')
.requires(
    'ash.framework',
    'ash.core.componentMatchingFamily',
    'ash.core.entityList',
    'ash.core.systemList'
)
.defines(function () {
    'use strict';

    ng.Ash.Engine = ng.Class.extend({
        familyClass: ng.Ash.ComponentMatchingFamily,
        families: null,
        entityList: null,
        systemList: null,
        updating: false,
        updateComplete: new signals.Signal(),

        init: function () {
            this.entityList = new ng.Ash.EntityList(),
            this.systemList = new ng.Ash.SystemList();
            this.families = new ng.Ash.Dictionary();

            this.property('entities', {
                get: function() {
                    var tmpEntities = [];
                    for( var entity = this.entityList.head; entity; entity = entity.next )
                    {
                        tmpEntities.push( entity );
                    }
                    return tmpEntities;
                }
            });

            this.property('systems', {
                get: function() {
                    var tmpSystems = [];
                    for( var system = this.systemList.head; system; system = system.next )
                    {
                        tmpSystems.push( system );
                    }
                    return tmpSystems;
                }
            });
        },

        addEntity: function (entity) {
            this.entityList.add( entity );
            entity.componentAdded.add( this.componentAdded, this );
            this.families.forEach( function( nodeObject, family ) {
                family.newEntity( entity );
            });
        },

        removeEntity: function (entity) {
            entity.componentAdded.remove( this.componentAdded, this );
            this.families.forEach( function( nodeObject, family ) {
                family.removeEntity( entity );
            });
            this.entityList.remove( entity );
        },

        removeAllEntities: function () {
            while( this.entityList.head ) {
                this.removeEntity( this.entityList.head );
            }
        },

        componentAdded: function (entity, componentClass) {
            this.families.forEach( function( nodeObject, family ) {
                family.componentAddedToEntity( entity, componentClass );
            });
        },

        getNodeList: function (nodeObject) {
            if( this.families.has( nodeObject ) ) {
                return this.families.retrieve( nodeObject ).nodes;
            }
            var family = new this.familyClass( nodeObject, this );
            this.families.add( nodeObject, family );
            for( var entity = this.entityList.head; entity; entity = entity.next ) {
                family.newEntity( entity );
            }
            return family.nodes;
        },

        releaseNodeList : function( nodeObject ) {
            if( this.families.has( nodeObject ) ) {
                this.families.retrieve( nodeObject ).cleanUp();
            }
            this.families.remove( nodeObject );
        },

        addSystem : function( system, priority ) {
            system.priority = priority;
            system.addToEngine( this );
            this.systemList.add( system );
        },

        getSystem : function( type ) {
            return this.systemList.get( type );
        },

        removeSystem : function( system ) {
            this.systemList.remove( system );
            system.removeFromEngine( this );
        },

        removeAllSystems : function() {
            while( this.systemList.head ) {
               this.removeSystem( this.systemList.head );
            }
        },

        update : function( time ) {
            this.updating = true;
            for( var system = this.systemList.head; system; system = system.next ) {
                system.update( time );
            }
            this.updating = false;
            this.updateComplete.dispatch();
        }
    });
});
