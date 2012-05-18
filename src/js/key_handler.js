/*globals _ */

(function() {
    var addEventHandler = function(obj, type, func) {
        if (obj.addEventListener) {
            obj.addEventListener(type, func, false);
        }

        else if (obj.attachEvent) {
            obj.attachEvent('on' + type, function() {
                func(window.event);
            });
        }
    };

    var KeyHandler = function() {
        var start = _.bind(function() {
            addEventHandler(document, 'keypress', dispatcher); 
        }, this);

        var setCallback = _.bind(function(func) {
            this.callback = func;
        }, this);

        var dispatcher = _.bind(function(event) {
            var keyCode = event.keyCode;
            var keyChar = String.fromCharCode(keyCode);

            if (this.callback) {
                this.callback(keyChar);
            }
        }, this);

        // expose public methods
        this.start = start;
        this.setCallback = setCallback;
    };

    window.KeyHandler = KeyHandler;
})();
