/**
 * Ash-js System
 */
ng.module('ash.core.system')
.requires('ash.framework')
.defines(function () {
    'use strict';

    ng.Ash.System = ng.Class.extend({
        previous: null, /* System */
        next: null, /* System */
        priority: 0,

        init: function () { },

        addToEngine: function (engine) {
            /* Left deliberately blank */
        },

        removeFromEngine: function (engine) {
            /* Left deliberately blank */
        },

        update: function (time) {
            /* Left deliberately blank */
        },

        is: function (type) {
            return type.prototype.isPrototypeOf(this);
        }
    });
});
