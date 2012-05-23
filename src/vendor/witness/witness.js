//  Witness 0.0.1
//  (c) 2012 Jake Harding
//  Witness is freely distributable under the MIT license.

(function(_, xevent) {
    // default configuration 
    var defaults = {
        captureControlKeys: true,
        capturePrintableChars: true
    };

    // TODO: missing keypad and branded keys
    var CONTROL_KEYS = {
        ENTER: 'ENTER',
        TAB: 'TAB',
        ESC: 'ESC',
        BACKSPACE: 'BACKSPACE',
        SHIFT: 'SHIFT',
        CONTROL: 'CONTROL',
        ALT: 'ALT',
        CAPS_LOCK: 'CAPS_LOCK',
        NUM_LOCK: 'NUM_LOCK',
        LEFT_ARROW: 'LEFT_ARROW',
        UP_ARROW: 'UP_ARROW',
        RIGHT_ARROW: 'RIGHT_ARROW',
        DOWN_ARROW: 'DOWN_ARROW',
        INSERT: 'INSERT',
        DELETE: 'DELETE',
        HOME: 'HOME', 
        END: 'END',
        PAGE_UP: 'PAGE_UP',
        PAGE_DOWN: 'PAGE_DOWN',
        F1: 'F1',
        F2: 'F2',
        F3: 'F3',
        F4: 'F4',
        F5: 'F5',
        F6: 'F6',
        F7: 'F7',
        F8: 'F8',
        F9: 'F9',
        F10: 'F10',
        F11: 'F11',
        F12: 'F12'
    };

    var CONTROL_KEY_CODES = {
        13: CONTROL_KEYS.ENTER,
        9: CONTROL_KEYS.TAB,
        27: CONTROL_KEYS.ESC,
        8: CONTROL_KEYS.BACKSPACE,
        16: CONTROL_KEYS.SHIFT,
        17: CONTROL_KEYS.CONTROL,
        18: CONTROL_KEYS.ALT,
        20: CONTROL_KEYS.CAPS_LOCK,
        144: CONTROL_KEYS.NUM_LOCK,
        37: CONTROL_KEYS.LEFT_ARROW,
        38: CONTROL_KEYS.UP_ARROW,
        39: CONTROL_KEYS.RIGHT_ARROW,
        40: CONTROL_KEYS.DOWN_ARROW,
        45: CONTROL_KEYS.INSERT,
        46: CONTROL_KEYS.DELETE,
        36: CONTROL_KEYS.HOME, 
        35: CONTROL_KEYS.END,
        33: CONTROL_KEYS.PAGE_UP,
        34: CONTROL_KEYS.PAGE_DOWN,
        112: CONTROL_KEYS.F1,
        113: CONTROL_KEYS.F2,
        114: CONTROL_KEYS.F3,
        115: CONTROL_KEYS.F4,
        116: CONTROL_KEYS.F5,
        117: CONTROL_KEYS.F6,
        118: CONTROL_KEYS.F7,
        119: CONTROL_KEYS.F8,
        120: CONTROL_KEYS.F9,
        121: CONTROL_KEYS.F10,
        122: CONTROL_KEYS.F11,
        123: CONTROL_KEYS.F12
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

    // exposing static map of control keys
    Witness.prototype.CONTROL_KEYS = CONTROL_KEYS;

    // expose Witness constructor globally
    window.Witness = Witness;
})(window._, window.xevent);
