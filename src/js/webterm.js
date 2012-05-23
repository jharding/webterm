//  WebTerm 0.0.0
//  (c) 2012 Jake Harding
//  WebTerm is freely distributable under the MIT license.

(function(_, Witness) {
    var defaults = {
        id: 'webterm',
        columns: 80,
        rows: 24,
        prompt: 'user:host $'
    };
   
    var WebTerm = function(config) {
        config = _.extend(defaults, config || {});

        var witness = new Witness();

        // DOM element references
        var $terminal = null;
        var $output = null;
        var $prompt = null;
        var $command = null;
        var $cursor = null;

        var start = function() {
            cacheElements();
            setPrompt(config.prompt);

            witness.start(); 
        };
     
        var cacheElements = function() {
            $terminal = document.getElementById(config.id);
            $output = $terminal.getElementsByClassName('wt-output')[0];
            $prompt = $terminal.getElementsByClassName('wt-prompt')[0];
            $command = $terminal.getElementsByClassName('wt-command')[0];
            $cursor = $terminal.getElementsByClassName('wt-cursor')[0];
        };

        var setPrompt = function(text) {
            $prompt.innerHTML = text;
        };

        var handleControlKey = function(key) {
            // TODO
        };

        var handlePrintableKey = function(key) {
            // transform spaces into no break spaces
            key.char = key.char.replace(' ', '&nbsp;');
            
            $command.innerHTML += key.char;
        };

        var handleKeyInput = function(key) {
            key.isPrintable ? handlePrintableKey(key) : handleControlKey(key);
        };

        witness.addCallback(handleKeyInput);

        // exposing public methods
        this.start = start;
    };

    window.WebTerm = WebTerm;
})(window._, window.Witness);
