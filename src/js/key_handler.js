/*globals _ */

(function() {
    var SPECIAL_KEY_CODES = [8, 9, 13, 27, 37, 38, 39, 40];

    // cross browser soultion for adding event listeners
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

    // cross browser solution for removing event listeners
    var removeEventHandler = function(obj, type, func) {
        if (obj.removeEventListener) {
            obj.removeEventListener(type, func);
        }

        else if (obj.detachEvent) {
            obj.detachEvent('on' + type, func);
        }
    };

    var getModifiers = function(keyEvent) {
        return {
            altKey: keyEvent.altKey || false,
            shiftKey: keyEvent.shiftKey || false,
            ctrlKey: keyEvent.ctrlKey || false,
            metaKey: keyEvent.metaKey || false
        };
    };

    var KeyHandler = function() {
        var start = _.bind(function() {
            addEventHandler(document, 'keypress', processKeyPress); 
            addEventHandler(document, 'keydown', processKeyDown); 
        }, this);

        var stop = _.bind(function() {
            removeEventHandler(document, 'keypress', processKeyPress); 
            removeEventHandler(document, 'keydown', processKeyDown); 
        }, this);

        var setCallback = _.bind(function(func) {
            this.callback = func;
        }, this);

        var processKeyPress = _.bind(function(event) {
            var keyCode = event.keyCode;

            // process non-special keys
            if (_(SPECIAL_KEY_CODES).indexOf(keyCode) === -1) {
                var keyChar = String.fromCharCode(keyCode);
                var modifiers = getModifiers(event);
                dispatch({
                    code: keyCode,
                    char: keyChar,
                    modifiers: modifiers
                });
            }
        }, this);

        var processKeyDown = _.bind(function(event) {
            var keyCode = event.keyCode;

            // process special keys
            if (_(SPECIAL_KEY_CODES).indexOf(keyCode) >= 0) {
                var modifiers = getModifiers(event);
                dispatch({
                    code: keyCode,
                    char: null,
                    modifiers: modifiers
                });
            }
        }, this);

        var dispatch = _.bind(function(key) {
            if (this.callback) {
                this.callback(key);
            }
        }, this);

        // expose public methods
        this.start = start;
        this.stop = stop;
        this.setCallback = setCallback;
        
        // map to do comparisons 
        this.SPECIAL_KEY_CODES_MAP = {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            ESC: 27,
            LEFT_ARROW: 37,
            UP_ARROW: 38,
            RIGHT_ARROW: 39,
            DOWN_ARROW: 40
        };
    };

    // expose KeyHandler constructor globally
    window.KeyHandler = KeyHandler;

    // testing purposes
    
    var outputDiv = document.createElement('div');
    outputDiv.id = 'output';
    document.getElementsByTagName('body')[0].appendChild(outputDiv);
    
    var keyHandler = new KeyHandler();
    keyHandler.setCallback(function(key) {
        outputDiv.innerHTML += key.char; 
    });
    keyHandler.start();
    
})();
