//  Witness 0.0.0
//  (c) 2012 Jake Harding
//  Witness is freely distributable under the MIT license.

(function(_, xevent) {
    // default configuration 
    var defaults = {
        captureControlKeys: true,
        capturePrintableChars: true
    };

    // TODO: missing keypad and branded keys
    var CONTROL_KEY_CODES = {
        13: 'ENTER',
        9: 'TAB',
        27: 'ESC',
        8: 'BACKSPACE',
        16: 'SHIFT',
        17: 'CONTROL',
        18: 'ALT',
        20: 'CAPS_LOCK',
        144: 'NUM_LOCK',
        37: 'LEFT_ARROW',
        38: 'UP_ARROW',
        39: 'RIGHT_ARROW',
        40: 'DOWN_ARROW',
        45: 'INSERT',
        46: 'DELETE',
        36: 'HOME', 
        35: 'END',
        33: 'PAGE_UP',
        34: 'PAGE_DOWN',
        112: 'F1',
        113: 'F2',
        114: 'F3',
        115: 'F4',
        116: 'F5',
        117: 'F6',
        118: 'F7',
        119: 'F8',
        120: 'F9',
        121: 'F10',
        122: 'F11',
        123: 'F12'
    };

    // helper method for extracting the modifier properties from
    // a key event object
    var extractModifiers = function(obj) {
        return {
            altKey: obj.altKey || false,
            shiftKey: obj.shiftKey || false,
            ctrlKey: obj.ctrlKey || false,
            metaKey: obj.metaKey || false
        };
    };

    // determines whether the charCode falls within the range of
    // ASCII printable characters
    var isPrintable = function(charCode) {
        return charCode > 31 && charCode < 127; 
    };

    var Witness = function(config) {
        config = _.extend(defaults, config || {}); 

        var callbacks = [];
        var isCapturing = false;
        
        var start = function() {
            // witness instance has already been started
            if (isCapturing) {
                return false;
            }

            if (config.captureControlKeys) {
                xevent.addEventHandler(document, 'keydown', processKeyDown);
            }

            if (config.capturePrintableChars) {
                xevent.addEventHandler(document, 'keypress', processKeyPress);
            }

            isCapturing = true;
            return true;
        };

        var stop = function() {
            // witness instance isn't capturing so there's nothing to stop
            if (!isCapturing) {
                return false;
            }

            xevent.removeEventHandler(document, 'keydown', processKeyDown); 
            xevent.removeEventHandler(document, 'keypress', processKeyPress);

            isCapturing = false;
            return true;
        };

        var addCallback = function(func) {
            // a function wasn't passed in so just return false to prevent
            // an error down the road
            if (!func || !_(func).isFunction()) {
                return false;
            }
            
            callbacks.push(func);
            return true;
        };

        var clearCallbacks = function() {
            callbacks = [];
        };

        var processKeyDown = function(event) {
            var keyCode = event.keyCode;

            // only dispatch if the key is a control key
            if (CONTROL_KEY_CODES[keyCode]) {
                var modifiers = extractModifiers(event);
                dispatch({
                    isPrintable: false,
                    isControl: true,
                    name: CONTROL_KEY_CODES[keyCode],
                    keyCode: keyCode,
                    modifiers: modifiers
                });
            }
        };

        var processKeyPress = function(event) {
            var charCode = _(event.charCode).isNumber() ?
                           event.charCode : event.keyCode;
          
            // only dispatch if the char is ASCII printable
           if (isPrintable(charCode)) {
                var modifiers = extractModifiers(event);
                dispatch({
                    isPrintable: true,
                    isControl: false,
                    char: String.fromCharCode(charCode),
                    charCode: charCode,
                    modifiers: modifiers
                });
           }
        };

        var dispatch = function(key) {
            _(callbacks).each(function(callback) {
                callback(key);
            });
        };

        // expose public methods
        this.start = start;
        this.stop = stop;
        this.addCallback = addCallback;
        this.clearCallbacks = clearCallbacks;
    };

    // expose Witness constructor globally
    window.Witness = Witness;
})(window._, window.xevent);
