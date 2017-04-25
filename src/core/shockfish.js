  /* eslint-disable no-unused-vars */
'use strict';
var shockfish = (function() {
    var eventListenerSupported = window.addEventListener;

    return {
        // Helper to transform array to dictionary.
        addToSet: function(set, array) {
            var l = array.length;
            while (l--) {
                set[array[l]] = true;
            }
            return set;
        },
        on: function(el, ev, handler) {
            if(eventListenerSupported) {
                el.addEventListener(ev, handler, false);
            } else if(document.attachEvent) {
                el.attachEvent('on' + ev, handler, false);
            }
        },
        off: function(el, ev, handler) {
            if(eventListenerSupported) {
                el.removeEventListener(ev, handler, false);
            } else if(document.detachEvent) {
                el.detachEvent('on' + ev, handler, false);
            }
        },
        // Check if a browser supports shockfish.js features.
        isSupported: function() {
            var ua = navigator.userAgent.toLowerCase();
            var version;
            // if a browser is not Internet Explorer.
            if (ua.indexOf('msie') === -1) {
                return true;
            }
            version = parseInt(ua.split('msie')[1], 10);
            // Check IE's version.
            if (version < 10) {
                return false;
            }
            return true;
        },
        // Publish a message.
        publish: function(msg) {
            console.log('Shockfish report:');
            console.log(msg);
        }
    };
}());
