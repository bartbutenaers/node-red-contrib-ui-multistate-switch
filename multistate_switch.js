/**
 * Copyright 2021 Bart Butenaers & hotNipi
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
    var settings = RED.settings;
    const mustache = require("mustache");

    function HTML(config) { 
        // Replace the dots in the id (by underscores), because we use it in element identifiers.
        // And then dots are not allowed, because otherwise you cannot find the element by id!
        config.id = config.id.replace(".", "_");
    
        // The configuration is a Javascript object, which needs to be converted to a JSON string
        var configAsJson = JSON.stringify(config);

        // - Make sure to set the width and height via CSS style (instead of the width and height html element attributes).
        //   This way the dashboard can calculate the size of the div correctly.  See:
        //   https://discourse.nodered.org/t/custom-ui-node-layout-problems/7731/21?u=bartbutenaers)
        // - The slider width: calc((100% - 2em) / 3); takes account of font size and makes itsel 2 unit smaller at the left
        // - Transform: translate(0.25em, 0px); moves quarter amount to right.
        //   That gives you oportunity to use straight percentages for positions (0%, 33%, 66%) (0%, 25%, 50%, 75%)
        var html = String.raw`
        <style>
            .multistate-switch-container{
                display:flex;
                width:100%;
                margin:auto;
            }
            .multistate-switch-container path{
                fill:currentColor !Important;
            }
            .multistate-switch-label{
                padding-right:1em;
                line-height: 1.4em;
                white-space: nowrap;
            }
            .multistate-switch-label-multiline{
                white-space: normal;
                line-height: 1.2em;
            }
            .multistate-switch-wrapper.disabled{
                border-color:gray;
                border-style:dashed;
            }
            .multistate-switch-wrapper{
                border:1px solid var(--nr-dashboard-widgetColor);
                display: flex;
                flex-flow: column nowrap;
                justify-content: center;
                align-items: center;
                position:relative;
                margin: auto 0;
                width:100%;
            }
            .multistate-slider-wrapper.disabled{
                opacity:0.5;
            }
            .multistate-slider-wrapper{
                height: 1em;
                padding-top: 0.25em;
                padding-bottom: 0.25em;
                z-index:0
            }
            .multistate-switch-body.disabled{
                color:gray;
                pointer-events:none; 
            }
            .multistate-switch-body{
                pointer-events:auto;
                display: inline-flex;
                justify-content: flex-start;
                width: 100%;
            }
            .multistate-switch-slider-${config.id}{
                width: calc((100% - (${config.options.length} * 0.5em)) / ${config.options.length});
            }
            .multistate-switch-slider{                
                background-color: var(--nr-dashboard-widgetColor);
                position: absolute;
                height: 1.2em;
                transform: translate(0.25em, -0.08em);
                transition: all .4s ease;
                left: 0%;
                z-index:0;
            }
            .multistate-switch-button-${config.id}{
                width:calc(100% / ${config.options.length}); 
            }
            .multistate-switch-button.disabled{
                pointer-events:none !important;
            }
            .multistate-switch-button.dark{
                color:var(--nr-dashboard-widgetBgndColor)
            }
            .multistate-switch-button.light{
                color:var(--nr-dashboard-widgetTextColor)
            }
            .multistate-switch-button{              
               text-align:center;
               z-index:1;
               outline: none;
               user-select:none;
               cursor:pointer;
               line-height: 1.4em;
            }
            .multistate-switch-round{
                border-radius: 1em;
            }
            .mss-ripple-${config.id} {
                position: relative;
                overflow: hidden;
                transform: translate3d(0, 0, 0);
                border-radius:${config.ripple.round}em;               
            }                        
            .mss-ripple-${config.id}:after {
              content: "";
              display: block;
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              pointer-events: none;
              background-image: radial-gradient(circle, ${config.ripple.color} 10%, transparent 10.01%);
              background-repeat: no-repeat;
              background-position: 50%;
              transform: scale(10,10);
              opacity: 0;
              transition: transform .5s, opacity 1s;
            }          
            .mss-ripple-${config.id}:active:after {
              transform: scale(0,0);
              opacity: .2;
              transition: 0s;
            }
        </style>
        <div class="multistate-switch-container" ng-init='init(` + configAsJson + `)'>
            <div ng-if="${config.label != ""}" id="multiStateSwitchLabel_` + config.id + `" class="multistate-switch-label" ng-class="{'multistate-switch-label-multiline':(config.multilineLabel)}">${config.label}</div>            
            <div id="multiStateSwitchContainer_` + config.id + `" class="multistate-switch-wrapper" ng-class="{'multistate-switch-round':(config.rounded)}">
                <div id="multiStateSwitchBody_` + config.id + `"" class="multistate-switch-body">
                    <div id="multiStateSwitchSliderWrapper_` + config.id + `" class="multistate-slider-wrapper">
                        <div id="multiStateSwitchSlider_` + config.id + `" class="multistate-switch-slider multistate-switch-slider-` + config.id + `" ng-class="{'multistate-switch-round':(config.rounded)}"></div>
                    </div>
                    <!-- The radio buttons will be inserted here dynamically on the frontend side -->
                </div>
            </div>
        </div>
        `;

        return html;
    }

    
    
    function checkConfig(node, conf) {
        if (!conf || !conf.hasOwnProperty("group")) {
            node.error("No group has been specified");
            return false;
        }
        return true;
    }
    
    var ui = undefined;
    
    function MultiStateSwitchNode(config) {
         try {
            var node = this;
            if(ui === undefined) {
                ui = RED.require("node-red-dashboard")(RED);
            }
           
            RED.nodes.createNode(this, config);       

            if (checkConfig(node, config)) { 

                config.dark = false
                if(typeof ui.isDark === "function"){
                    config.dark = ui.isDark()
                    config.themeColor = ui.getTheme()["widget-backgroundColor"].value
                }
                config.ripple = {
                    color:config.dark ? "#FFF" : "#000",
                    round:config.rounded ? 1 : 0
                }

                // Add default values to older nodes (version 1.0.0)
                config.stateField = config.stateField || 'payload';
                config.enableField = config.enableField || 'enable';
                
                // Add default values to older nodes (version 1.1.0)
                config.passthroughField = config.passthroughField || 'passthrough';
                config.inputMsgField = config.inputMsgField || 'inputmsg';
                
                config.enabled = true;
            
                var html = HTML(config);
                var done = ui.addWidget({
                    node: node,
                    group: config.group,
                    order: config.order, 
                    width: config.width,
                    height: config.height,
                    format: html,
                    templateScope: "local",
                    emitOnlyNewValues: false,
                    forwardInputMessages: false,
                    storeFrontEndInputAsState: true,
                    convertBack: function (value) {
                        return value;
                    },
                    beforeEmit: function(msg, value) {   
                        var newMsg = {};

                        if (msg) {
                            // Copy the socket id from the original input message. 
                            newMsg.socketid = msg.socketid;
                            
                            // Try to get the specified message fields, and copy those to predefined fixed message fields.
                            // This way the message has been flattened, so the client doesn't need to access the nested msg properties.
                            // See https://discourse.nodered.org/t/red-in-ui-nodes/29824/2
                            try {
                                // Get the new state value from the specified message field
                                newMsg.state = RED.util.getMessageProperty(msg, config.stateField || "payload");
                            } 
                            catch(err) {
                                // No problem because the state field is optional ...
                            }
                            
                            try {
                                // Get the new enable value from the specified message field
                                var enable = RED.util.getMessageProperty(msg, config.enableField);
                                
                                if (enable != undefined) {
                                    if (enable === true || enable === false || enable === "enabled_show" || enable === "enabled_not_show" || enable === "disabled") {
                                        config.enabled = enable; // Remember the current value (only required for the next msg, because it won't be used on the server side)
                                        newMsg.enable = enable;
                                    }
                                    else {
                                        node.error("The 'enable' message field value should contain true, false, 'enabled_show', 'enabled_not_show' or 'disabled'");
                                    }
                                } 
                            } 
                            catch(err) {
                                // No problem because the enable value is optional ...
                            }
                            
                            try {
                                // Get the new passthrough value from the specified message field.
                                var passthrough = RED.util.getMessageProperty(msg, config.passthroughField);
                                
                                if (passthrough != undefined) {
                                    if (passthrough === "never" || passthrough === "always" || passthrough === "change") {
                                        // The passthrough will be executed only on the server side, so store the value in the config (but no need to put it in newMsg)
                                        config.passThrough = RED.util.getMessageProperty(msg, config.passthroughField);
                                    }
                                    else {
                                        node.error("The 'passthrough' message field value should contain 'never', 'always' or 'change'");
                                    }
                                }
                            } 
                            catch(err) {
                                // No problem because the enable value is optional ...
                            }
                            
                            try {
                                // Get the new input msg value from the specified message field.
                                var inputMsg = RED.util.getMessageProperty(msg, config.inputMsgField);
                                
                                if (inputMsg != undefined) {
                                    if (inputMsg === "none" || inputMsg === "all") {
                                        // The input msg filtering will be executed only on the server side, so store the value in the config.
                                        config.inputMsg = inputMsg;
                                        // But the same config will also be used on the client side!
                                        newMsg.inputMsg = inputMsg;
                                    }
                                    else {
                                        node.error("The 'input msg' message field value should contain 'none' or 'all'");
                                    }
                                }
                            } 
                            catch(err) {
                                // No problem because the enable value is optional ...
                            }
                            
                            // The label can contain a mustache expression, so resolve it (based on the input message content)
                            newMsg.label = mustache.render(config.label, msg);
                        }
                        
                        // Determine whether the input message should be passed through to the output.
                        // Note that there can't be pass through when input messages are rejected (inputMsg is 'none').
                        // So we need to take into account here that those messages will get rejected on the client side watch!
                        if (config.inputMsg != "none") {
                            switch (config.passThrough) {
                                case "always":
                                    node.send(msg);
                                    break;
                                case "change":
                                    // TODO check for valid state value...
                                    if (this.currentSwitchState != newMsg.state) {
                                        node.send(msg);
                                    }
                                    break;
                                case "never":
                                    // Never pass through
                                    break;
                            }
                        }

                        // When the message doesn't contain a state, then inject the current state into it (if available).
                        // That way replayed input messages will always contain the latest state.
                        if (newMsg.state == undefined && this.currentSwitchState != undefined) {
                            newMsg.state = this.currentSwitchState;
                        }
                        
                        // When the message doesn't contain whether the switch is enabled, then inject into it whether it is enabled (if available).
                        // That way replayed input messages will always contain whether the switch should be enabled.
                        if (newMsg.enable == undefined) {
                            newMsg.enable = config.enabled;
                        }   
                            
                        // When the message doesn't contain whether the node accepts input messages, then inject into it whether the node accepts input messages.
                        // That way replayed input messages will always contain whether the switch should accept input messages.
                        if(newMsg.inputMsg == undefined) {
                            newMsg.inputMsg = config.inputMsg;
                        }
                    
                        return { msg: newMsg };
                    },
                    beforeSend: function (msg, orig) {
                        if (orig) {
                            var newMsg = {};
                            // Store the switch state in the specified msg state field
                            RED.util.setMessageProperty(newMsg, config.stateField, orig.msg.state, true)
                            //orig.msg = newMsg;
                            
                            this.currentSwitchState = orig.msg.state;
                            
                            // Don't send the message to the output, if that is specified in the original message
                            // See https://discourse.nodered.org/t/getting-errors-to-the-server-side-in-ui-node/24999/5?u=bartbutenaers
                            if (!orig.msg.sendOutputMsg) {
                                orig["_fromInput"] = true; // Legacy code for older dashboard versions
                                orig["_dontSend"] = true;
                            }

                            return newMsg;
                        }
                    },
                    initController: function($scope, events) {
                        $scope.flag = true;

                        $scope.init = function (config) {
                            $scope.config = config;

                            $scope.containerDiv = $("#multiStateSwitchContainer_" + config.id)[0];
                            $scope.sliderDivElement = $("#multiStateSwitchSlider_" + config.id)[0];
                            $scope.sliderWrapperElement = $("#multiStateSwitchSliderWrapper_" + config.id)[0];
                            
                            // Hide selected label when required (by showing slider on top of buttons)
                            if (config.hideSelectedLabel == true) {
                                // Use an inline style to apply this only to this node's slider
                                $scope.sliderWrapperElement.style.zIndex = 3;
                            }

                            // Get a reference to the sub-DIV element
                            var toggleRadioDiv = $scope.containerDiv.firstElementChild;
                            
                            $scope.previousSelectedDivIndex = -1;
                            $scope.serverSyncAllowed = false;

                            // Create all the required  button elements
                            config.options.forEach(function (option, index) {
                                if (index === 0) {
                                    // Make sure the initial element gets the correct color
                                    switchStateChanged(option.value, false, false, true);
                                }
                                
                                var divElement = document.createElement("div");
                                divElement.setAttribute("class", "multistate-switch-button mss-ripple-"+config.id+" multistate-switch-button-"+config.id );
                                divElement.setAttribute("id", "mstbtn_"+config.id+"_"+index)
                                divElement.innerHTML = option.label;
                                divElement.addEventListener("click",  function() {
                                    switchStateChanged(option.value, true, true, true);
                                });

                                toggleRadioDiv.appendChild(divElement);
                            });
                            
                            // Disable the switch, when no user input is allowed
                            if (config.userInput == "disabled") {
                                disable(true);
                            }
                        }

                        $scope.$watch('msg', function(msg) {
                            // Ignore undefined messages.
                            if (!msg) {
                                return;
                            }

                            // Accept or not input messages.
                            // Note that this needs to be called before the input message is rejected (in the next check), otherwise we can never reactivate input messages again ...
                            if (msg.inputMsg) {
                                $scope.config.inputMsg = msg.inputMsg;
                            }

                            // When input messages need to be ignored, this is (unfortunately) not possible on server side of UI nodes.
                            // Which means to messages will be emitted to the client, and we will reject them here...
                            // See https://discourse.nodered.org/t/validate-input-message-in-ui-node/11393/8?u=bartbutenaers
                            if ($scope.config.inputMsg == "none") {
                                return;
                            }
                            
                            // When the user changes the switch position, then a message will be sent containing the new state.
                            // Immediately afterwards that message will be replayed and arrive here.  However when we don't visualize
                            // the new state, then the replayed message would cause the new state to be visualized anyway.  Therefore
                            // replayed messages from the same session will be ignored.
                            // Caution: only apply this for type 'enabled_not_show', otherwise there is no sync anymore (between dashboards or after refresh).
                            if ($scope.config.userInput == "enabled_not_show") {
                                if (msg.originId == $scope.config.id) {
                                    return;
                                }
                            }

                            // Enable or disable the user input via input messages.
                            // Note that in old nodes (version 1.1.0 and below) a boolean would be injected, so we need to migrate those boolean values.
                            // The "enabled_not_show" is a new extra mode, so there is no boolean counterpart for that mode...
                            if (msg.enable === true || msg.enable === "enabled_show") {
                                $scope.config.userInput = "enabled_show";
                                disable(false);
                            }
                            else if (msg.enable === false || msg.enable === "disabled") {
                                $scope.config.userInput = "disabled";
                                disable(true);
                            }
                            else if (msg.enable === "enabled_not_show") {
                                $scope.config.userInput = "enabled_not_show";
                                disable(false);
                            }
    
                            if (msg.state != undefined) {
                                // When a new message arrives that sets a new state, then that state needs to be send to the server (to have the
                                // latest state on the server).  However when a replayed message arrives, that should NOT be sent to the server again.
                                // Otherwise the switch will start switching continiously between the states, by different input messages arriving!
                                var syncToServer = (msg.originId != $scope.config.id);
                                
                                // The msg.payload contains the new switch state value
                                // Note that an input message doesn't need to trigger an output message
                                switchStateChanged(msg.state, false, false, syncToServer);
                            }

                            if (msg.label != undefined) {
                                // When a label is passed, then show it
                                $("#multiStateSwitchLabel_" + $scope.config.id).html(msg.label);
                            }
                        });

                        function disable(state){                            
                            //true - widget disabled, false - widget enabled
                            if(state == true){
                                $("#multiStateSwitchContainer_"+$scope.config.id).addClass('disabled')
                                $("#multiStateSwitchBody_"+$scope.config.id).addClass('disabled')                               
                                $("#multiStateSwitchSliderWrapper_"+$scope.config.id).addClass('disabled')
                                $scope.config.options.forEach(function (option, index) {
                                        $("#mstbtn_"+$scope.config.id+"_"+index).addClass('disabled')
                                });
                            }
                            else{
                                $("#multiStateSwitchContainer_"+$scope.config.id).removeClass('disabled')
                                $("#multiStateSwitchBody_"+$scope.config.id).removeClass('disabled')                               
                                $("#multiStateSwitchSliderWrapper_"+$scope.config.id).removeClass('disabled')
                                $scope.config.options.forEach(function (option, index) {
                                    $("#mstbtn_"+$scope.config.id+"_"+index).removeClass('disabled')
                                });
                            }
                        }

                        function txtClassToStandOut(bgColor, light, dark) {
                            var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
                            var r = parseInt(color.substring(0, 2), 16);
                            var g = parseInt(color.substring(2, 4), 16);
                            var b = parseInt(color.substring(4, 6), 16);
                            var uicolors = [r / 255, g / 255, b / 255];
                            var c = uicolors.map((col) => {
                              if (col <= 0.03928) {
                                return col / 12.92;
                              }
                              return Math.pow((col + 0.055) / 1.055, 2.4);
                            });
                            var L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
                            
                            if($scope.config.dark){
                                return (L > 0.5) ?  dark : light;
                            }
                            return (L > 0.27) ?  light : dark;
                        }
                        
                        // sendOutputMsg: whether the message must be send (server side) to the output
                        // userInput: whether the new state was triggered by user input (click/touch)
                        function switchStateChanged(newValue, sendOutputMsg, userInput, syncToServer) {
                            var selectedDivIndex = -1;
                            var col

                            // Try to find an option with a value identical to the specified value
                            // For every button be sure that button exists and change mouse cursor and pointer-events
                            $scope.config.options.forEach(function (option, index) {
                                // Show the unselected buttons as active, when no user input or the user input needs to be visualized
                                if (!userInput || $scope.config.userInput == "enabled_show") {
                                    if($("#mstbtn_"+$scope.config.id+"_"+index).length){
                                        $("#mstbtn_"+$scope.config.id+"_"+index).css({"cursor":"pointer","pointer-events":"auto"})
                                        $("#mstbtn_"+$scope.config.id+"_"+index).removeClass("light dark")
                                    }
                                }
                                
                                // Trick: add an empty character to convert booleans to strings, which is required because e.g. "true"==true would return false
                                if (option.value == newValue+'') {
                                    // Show the selected buttons as inactive, when no user input or the user input needs to be visalized
                                    if (!userInput || $scope.config.userInput == "enabled_show") {
                                        // selected button inactive 
                                        if($("#mstbtn_"+$scope.config.id+"_"+index).length){
                                            $("#mstbtn_"+$scope.config.id+"_"+index).css({"cursor":"default","pointer-events":"none"})
                                            col = $scope.config.useThemeColors ? $scope.config.themeColor : option.color
                                            $("#mstbtn_"+$scope.config.id+"_"+index).addClass(txtClassToStandOut(col,"light","dark"))
                                        }
                                    }
                                    
                                    selectedDivIndex = index;
                                }
                            });

                            if (selectedDivIndex >= 0) {
                                // Move the slider, when no user input or the user input needs to be visualized
                                if (!userInput || $scope.config.userInput == "enabled_show") {
                                    var percentage = "0%";
              
                                    if ($scope.config.options.length > 0 && selectedDivIndex >= 0) {
                                        percentage = (100 / $scope.config.options.length) * selectedDivIndex;
                                        $scope.sliderDivElement.style.left = percentage + "%";
              
                                        if ($scope.config.useThemeColors != true) {
                                            $scope.sliderDivElement.style.backgroundColor = $scope.config.options[selectedDivIndex].color;
                                        }
                                    }
                                }
                                
                                // Make sure that numbers always appear as the correct type in the output message (instead of strings)
                                switch ($scope.config.options[selectedDivIndex].valueType) {
                                    case "num":
                                        newValue = Number(newValue);
                                        break;
                                    case "bool":
                                        newValue = (newValue === 'true');
                                        break;
                                }                                
                                
                                // Most of the time send the state to the server, so the server side state is up-to-date.
                                // Pass also the sendOutputMsg parameter, so the beforeSend can detect whether the msg should be send as output message.
                                // Don't resend when nothing changed, otherwise the first replay msg will cause an infinite loop (between client and server)!
                                if (syncToServer) {
                                    // Check and allow server sync after inital state is settled.
                                    // Otherwise - after a browser window refresh - a replayed message will re-initialize the switch position...
                                    if($scope.serverSyncAllowed == false){
                                          $scope.previousSelectedDivIndex = selectedDivIndex;
                                          $scope.serverSyncAllowed = true
                                          return
                                    }
                                    
                                    if (selectedDivIndex != $scope.previousSelectedDivIndex) {
                                        $scope.send({
                                            state: newValue,
                                            sendOutputMsg: sendOutputMsg,
                                            originId: $scope.config.id,
                                            // Make sure that the replayed output messages contain all the information to restore the switch into the correct state.
                                            // Similar to what the onBeforeEmit function does for (replayed) 'input' messages...
                                            // Note that we will need to do this on the client side, because it is this message that is replayed (not the output
                                            // message that has been manipulated inside the onBeforeSend...
                                            enable: $scope.config.userInput,
                                            inputMsg: $scope.config.inputMsg                                        
                                        });
                                    }
                                }
                                
                                $scope.previousSelectedDivIndex = selectedDivIndex;
                            }
                            else {
                                console.log("No radio button has value '" + newValue + "'");
                            }
                        }
                    }
                });
            }
        }
        catch (e) {
            // Server side errors 
            node.error(e);
            console.trace(e); // stacktrace
        }
		
        node.on("close", function() {
            if (done) {
                done();
            }
        });
    }

    RED.nodes.registerType("ui_multistate_switch", MultiStateSwitchNode);
}
