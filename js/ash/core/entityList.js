/**
 * Ash-js EntityList
 */
ng.module('ash.core.entityList')
.requires(
    'ash.framework'
    )
.defines(function (Class) {
    'use strict';

    ng.Ash.EntityList = ng.Class.extend({
        head: null, /* Entity */
        tail: null, /* Entity */

        init: function () { },

        add: function( entity ) {
            if( !this.head ) {
                this.head = this.tail = entity;
            } else {
                this.tail.next = entity;
                entity.previous = this.tail;
                this.tail = entity;
            }
        },

        remove: function( entity ) {
            if ( this.head == entity ) {
                this.head = this.head.next;
            }
            if ( this.tail == entity ) {
                this.tail = this.tail.previous;
            }
            if ( entity.previous ) {
                entity.previous.next = entity.next;
            }
            if ( entity.next ) {
                entity.next.previous = entity.previous;
            }
        },

        removeAll: function() {
            while( this.head ) {
                var entity = this.head;
                this.head = this.head.next;
                entity.previous = null;
                entity.next = null;
            }
            this.tail = null;
        }
    });
});
