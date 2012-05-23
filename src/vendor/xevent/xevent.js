//  Xevent 0.0.1
//  (c) 2012 Jake Harding
//  Xevent is freely distributable under the MIT license.

(function() {
    var xevent = {
        addEventHandler: function(obj, type, func) {
            if (obj.addEventListener) {
                obj.addEventListener(type, func, false);
            }

            else if (obj.attachEvent) {
                obj.attachEvent('on' + type, function() {
                    func(window.event);
                });
            }
        },

        removeEventHandler: function(obj, type, func) {
            if (obj.removeEventListener) {
                obj.removeEventListener(type, func);
            }

            else if (obj.detachEvent) {
                obj.detachEvent('on' + type, func);
            }
        },

        preventDefault: function(event) {
            if (event.preventDefault) {
                event.preventDefault();
            }

            else {
                event.returnValue = false;
            }
        },

        stopPropagation: function(event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            }

            else {
                event.cancelBubble = true;
            }
        }
    };

    // exposing xevent globally
    window.xevent = xevent;
})();
