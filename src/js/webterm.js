//  WebTerm 0.0.0
//  (c) 2012 Jake Harding
//  WebTerm is freely distributable under the MIT license.

(function(_, Witness) {
    var defaults = {
        id: 'webterm',
        columns: 80,
        rows: 24,
        prompt: 'user:host $ '
    };

    // cross browser function for getting the value of a style property
    // for a given element
    var getStyle = function(element, property) {
        var camelize = function (str) {
            return str.replace(/\-(\w)/g, function(str, letter){
                return letter.toUpperCase();
            });
        };

        // IE
        if (element.currentStyle) {
            return element.currentStyle[camelize(property)];
        }

        // Firefox and WebKit
        else if (document.defaultView && document.defaultView.getComputedStyle) {
            return document.defaultView.getComputedStyle(element,null).
                   getPropertyValue(property);
        }

        // oh god, oh god, oh god
        else {
            return element.style[camelize(property)]; 
        }

    };

    var WebTerm = function(config) {
        config = _.extend(defaults, config || {});

        var witness = new Witness();

        var commandText = '';
        var columnsAvailable = config.columns - config.prompt.length;

        // DOM element references, will be assigned in the 
        // constructTerminal function
        var $terminal = null;
        var $output = null;
        var $prompt = null;
        var $cursor = null;
        var $command = null;
        var $commandOverflow = null;

        var start = function() {
            constructTerminal();
            setPrompt(config.prompt);

            witness.start(); 
        };
     
        var constructTerminal = function() {
            $terminal = document.getElementById(config.id);
            $output = $terminal.getElementsByClassName('wt-output')[0];
            $prompt = $terminal.getElementsByClassName('wt-prompt')[0];
            $cursor = $terminal.getElementsByClassName('wt-cursor')[0];
            $command = $terminal.getElementsByClassName('wt-command')[0];
            $commandOverflow = $terminal.
                               getElementsByClassName('wt-command-overflow')[0];

           
            // styling info needed for calculating terminal dimensions
            var fontSize = parseInt(getStyle($terminal, 'font-size'), 10);
            var lineHeight = parseInt(getStyle($terminal, 'line-height'), 10);

            // set the dimensions of the terminal based on font styling
            // and the number of rows and columns
            // TODO: fontSize doesn't actually provide the width of the font
            $terminal.style.height = (lineHeight * config.rows) + 'px';
            $terminal.style.width = (fontSize * config.columns) + 'px';
        };

        var setPrompt = function(text) {
            $prompt.innerHTML = text.replace(' ', '&nbsp;');
        };

        var appendCursor = function(element) {
            if (element.nextSibling) {
                element.parentNode.insertBefore($cursor, element.nextSibling);
            }

            else {
                element.parentNode.appendChild($cursor);
            }
        };

        var updateCommand = function(text) {
            // no overflow
            if (text.length <= columnsAvailable) {
                $command.innerHTML = text;
                $commandOverflow.innerHTML = '';

                appendCursor($command);
            }

            // overflow
            else {
                $command.innerHTML = text.slice(0, columnsAvailable - 1);
                $commandOverflow.innerHTML = text.slice(columnsAvailable);

                appendCursor($commandOverflow);
            }
        };

        var handleControlKey = function(key) {
            switch (key.type) {
                case witness.CONTROL_KEYS.BACKSPACE:
                    // remove last character
                    commandText = commandText.slice(0, -1);
                    updateCommand(commandText);
                    
                    break;
                case witness.CONTROL_KEYS.ENTER:
                    // TODO: execute the command
                    break;
                default:
                    // no-op
                    break;
            }
        };

        var handlePrintableChar = function(key) {
            // transform spaces into no break spaces and append character
            // to the command text
            commandText += key.char.replace(' ', '&nbsp;');
            updateCommand(commandText);
        };

        var handleKeyInput = function(key) {
            if (key.isPrintableChar) {
                handlePrintableChar(key);
            }

            else {
                 handleControlKey(key);
            }
        };

        witness.addCallback(handleKeyInput);

        // exposing public methods
        this.start = start;
    };

    window.WebTerm = WebTerm;
})(window._, window.Witness);
