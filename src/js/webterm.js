/*globals _, KeyHandler */

(function() {
    var defaults = {
        terminalId: 'webterm',
        outputId: 'wt-output',
        commandPromptId: 'wt-command-prompt',
        cols: 80,
        rows: 24
    };

    var WebTerm = function(conf) {
        this.conf = conf || {};
        this.conf = _.extend(defaults, this.conf);

        var init = _.bind(function() {
            this.terminal = buildTerminal();

            var keyHandler = new KeyHandler();
            keyHandler.setCallback(handleKeyInput);
            keyHandler.start();

        }, this);

        var buildTerminal = _.bind(function() {
            var conf = this.conf;
            
            var terminal = document.createElement('div');
            terminal.id = conf.terminalId;

            // the container for previous commands and their results
            var output = document.createElement('div');
            output.id = conf.outputId;
            terminal.appendChild(output);

            var commandPrompt = document.createElement('p');
            commandPrompt.id = conf.commandPromptId;
            terminal.appendChild(commandPrompt);

            var body = document.getElementsByTagName('body')[0];
            body.appendChild(terminal);

            return {
                container: terminal,
                output: output,
                commandPrompt: commandPrompt
            };
        }, this);

        var handleKeyInput = _.bind(function(keyChar) {
            this.terminal.commandPrompt.innerHTML += keyChar;
        }, this);

        // expose public methods
        this.init = init;
    };

    // for testing, needs to be removed eventually
    var webTerm = new WebTerm();
    webTerm.init();
})();
