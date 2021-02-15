/**
 * Copyright 2021 Bart Butenaers
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

    function HTML(config) { 
        // Replace the dots in the id (by underscores), because we use it in element identifiers.
        // And then dots are not allowed, because otherwise you cannot find the element by id!
        config.id = config.id.replace(".", "_");
    
        // The configuration is a Javascript object, which needs to be converted to a JSON string
        var configAsJson = JSON.stringify(config);

        // Make sure to set the width and height via CSS style (instead of the width and height html element attributes).
        // This way the dashboard can calculate the size of the div correctly.  See:
        // https://discourse.nodered.org/t/custom-ui-node-layout-problems/7731/21?u=bartbutenaers)
        var html = String.raw`
        <style>
            .switchwrapper { 
                margin: auto 0;
            }
            .toggle_radio{
                position: relative; 
                margin: auto;
                overflow: hidden;
                border-radius: 50px;
                position: relative;
                height: 26px;
                border: 1px solid var(--nr-dashboard-groupBorderColor);
                background: var(--nr-dashboard-widgetBgndColor);
            }
            .toggle_radio > * {
                float: left;
            }
            .toggle_radio input[type=radio]{
                display: none;
            }
            .toggle_radio label{
                display: block;
                height: 20px;
                margin: 0;
                line-height :18px;
                border-radius: 50px;
                cursor: pointer;
                z-index: 1;
                text-align: center;
            }
            .toggle_radio label >p {
                background:transparent !important;
            }
            .toggle_option_slider{
                height: 20px;
                position: absolute;
                top: 3px;
                border-radius: 50px;
                transition: all .4s ease;
                z-index:0;
                left:3px;
                opacity:0.4;
            background: var(--nr-dashboard-widgetColor);
        }
        </style>

        <div id="multiStateSwitchContainer_` + config.id + `" class="switchwrapper" ng-init='init(` + configAsJson + `)'>
            <div class="toggle_radio">
               
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
                    storeFrontEndInputAsState: false,
                    convertBack: function (value) {
                        return value;
                    },
                    beforeEmit: function(msg, value) {
                        return { msg: msg };
                    },
                    beforeSend: function (msg, orig) {
                        if (orig) {
                            return orig.msg;
                        }
                    },
                    initController: function($scope, events) {
                        $scope.flag = true;

                        $scope.init = function (config) {
                            $scope.config = config;

                            $scope.containerDiv = $("#multiStateSwitchContainer_" + config.id);
                            
                            // Get a reference to the sub-DIV element
                            var toggleRadioDiv = $scope.containerDiv[0].firstElementChild;
                            
                            // Create a slider DIV element 
                            $scope.sliderDivElement = document.createElement("div");
                            $scope.sliderDivElement.setAttribute("id", "multiStateSwitchSlider_" + config.id);
                            $scope.sliderDivElement.setAttribute("class", "toggle_option_slider");
                            if ($scope.config.options.length === 0) {
                                $scope.sliderDivElement.style.width = "100%";
                            }
                            else {
                                // The slider width depends on the number of options
                                $scope.sliderDivElement.style.width = (100 / $scope.config.options.length) + "%";
                            }
                            toggleRadioDiv.appendChild($scope.sliderDivElement);
                            
                            // Create all the required radio button elements
                            config.options.forEach(function (option, index) {
                                var inputElement = document.createElement("input");
                                inputElement.setAttribute("type", "radio");
                                inputElement.setAttribute("id", "radioButton_" + config.id + "_" + index);
                                inputElement.setAttribute("class", "toggle_option");
                                inputElement.setAttribute("name", "toggle_option"); // group name
                                inputElement.setAttribute("value", option.value);
                                inputElement.setAttribute("ng-model", "radioButton.value");
                                inputElement.addEventListener("click",  function() {
                                    switchStateChanged(option.value);
                                });
                                
                                if (index === 0) {
                                    inputElement.checked = true;
                                }
                                
                                var labelElement = document.createElement("label");
                                if ($scope.config.options.length === 0) {
                                    labelElement.style.width = "100%";
                                }
                                else {
                                    // The radio button width depends on the number of options
                                    labelElement.style.width = (100 / $scope.config.options.length) + "%";
                                }
                                var paragraphElement = document.createElement("p");
                                paragraphElement.innerHTML = "<p>" + option.label + "</p>";
                                labelElement.appendChild(inputElement);
                                labelElement.appendChild(paragraphElement);
                                
                                toggleRadioDiv.appendChild(labelElement);
                            });
                        }

                        $scope.$watch('msg', function(msg) {
                            // Ignore undefined messages.
                            if (!msg || !msg.payload) {
                                return;
                            }

                            // The msg.payload contains the new switch state value
                            switchStateChanged(msg.payload);
                        });
                        
                        function switchStateChanged(newValue) {
                            var radioButtonIndex = -1;
                            
                            // Try to find an option with a value identical to the specified value
                            $scope.config.options.forEach(function (option, index) {
                                if (option.value === newValue) {
                                    radioButtonIndex = index;
                                }
                            });
                            
                            if (radioButtonIndex >= 0) {
                                if (radioButtonIndex == 0) {
                                    $scope.sliderDivElement.style.left = "3px";
                                }
                                else {
                                    var percentage = (100 / $scope.config.options.length) * radioButtonIndex;
                                    $scope.sliderDivElement.style.left = percentage + "%";
                                }
                                    
                                $scope.send({payload: newValue});
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

    RED.nodes.registerType("ui_mult_state_switch", MultiStateSwitchNode);
}
