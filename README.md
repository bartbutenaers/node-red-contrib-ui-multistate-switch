# node-red-contrib-ui-multistate-switch
A Node Red node to show a switch with multiple states in the Node-RED dashboard.

All credits for the CSS go to [hotnipi](https://github.com/hotNipi), my partner in crime for this node!

## Install
Run the following npm command in your Node-RED user directory (typically ~/.node-red):
```
npm install node-red-contrib-ui-multistate-switch
```

## Node usage
This node allows to show a multi-state switch in a few steps:

1. Specify in the config screen to use the theme colors, or otherwise specify a separate color for each option:

   ![Config screen](https://user-images.githubusercontent.com/14224149/108424269-3d2d1880-7239-11eb-9b36-b125b8df632e.png)
   
   + The ***label*** is the text that will be displayed.
   + The ***value*** will be the payload in the input and output messages.
   + The ***color*** is the color of the options.

2. These options will be displayed in the dashboard:

   ![multi_switch_color_demo](https://user-images.githubusercontent.com/14224149/108424592-af056200-7239-11eb-9255-217b36a35576.gif)

   As soon as a button is clicked, it's value will be send in the `msg.payload` of the output message.
   
 3. It is also possible to inject an input message, with the new value in the `msg.payload`.  The corresponding option will automatically be selected in the dashboard.

## Node properties

### Label
The label is the text which is displayed in front of the switch.
Note that the label can contain Mustache syntax, in case the label needs to be changed dynamically via input messages.  See [this](https://github.com/bartbutenaers/node-red-contrib-ui-multistate-switch/wiki/Dynamic-label-via-Mustache-expressions) wiki page for more information.

Extra options:
+ Via the *"Appearance"* option (see below), ***multi-line labels*** can be activated:

   ![Multi-line label](https://user-images.githubusercontent.com/14224149/131564936-2b2de7fa-6292-433a-936f-48d0ebb70f98.png)

+ When dealing with a long multi-line label, it might be useful to increase the ***height*** of this widget:

   ![Height increased](https://user-images.githubusercontent.com/14224149/131565108-b86b3ec3-f2d3-4c97-9bc4-256f3928def9.png)

+ It is also possible to show an ***icon*** inside the label.  See [this](https://github.com/bartbutenaers/node-red-contrib-ui-multistate-switch/wiki/Displaying-icons-in-the-switch) wiki page for more information.

### Appearance
The appearance determines the shape of the switch button, which allows you to have ***rounded corners***:

![Appearance](https://user-images.githubusercontent.com/14224149/108561643-e4c04e80-72fe-11eb-88c3-3ea4af5256e6.png)

For advanced users, the following flow contains a Template node with a very simple CSS script to achieve the same result:
```
[{"id":"11079fb1.5eebe","type":"ui_template","z":"2b6f5d19.202242","group":"9f2da61.3353758","name":"Dashboard CSS","order":2,"width":12,"height":1,"format":"<style>\n    .multistate-switch-wrapper{\n        border-radius:15px;\n    }\n    .multistate-switch-slider{\n        border-radius:15px;\n    }\n</style>","storeOutMessages":true,"fwdInMessages":true,"resendOnRefresh":true,"templateScope":"global","x":460,"y":1960,"wires":[[]]},{"id":"1730cdc0.2bad52","type":"ui_multistate_switch","z":"2b6f5d19.202242","name":"","group":"28a39865.fa3608","order":2,"width":"9","height":0,"label":"Thermostat","options":[{"label":"Option 0","value":"option_0","valueType":"str"},{"label":"Option 1","value":"option_1","valueType":"str"},{"label":"Option 2","value":"option_2","valueType":"str"}],"x":460,"y":1900,"wires":[[]]},{"id":"9f2da61.3353758","type":"ui_group","name":"Flight","tab":"d6d3c358.5fb46","order":1,"disp":true,"width":"12","collapse":false},{"id":"28a39865.fa3608","type":"ui_group","z":"","name":"Default","tab":"d8520920.0128d8","order":1,"disp":true,"width":"9","collapse":false},{"id":"d6d3c358.5fb46","type":"ui_tab","name":"Home","icon":"dashboard","order":1,"disabled":false,"hidden":false},{"id":"d8520920.0128d8","type":"ui_tab","name":"Home","icon":"dashboard","disabled":false,"hidden":false}]
```

### Use theme colors
When activated, the switch will be displayed in the current theme colors.  When not activated, it is possible to select a separate custom color for each option.

![Theme colors](https://user-images.githubusercontent.com/14224149/108561941-60ba9680-72ff-11eb-9232-08549bd24172.png)

### Hide label of selected option
When activated, the label of the selected option will not be displayed:

![Hide label](https://user-images.githubusercontent.com/14224149/108561285-42a06680-72fe-11eb-916e-4f8a49a26a61.png)

### Passthrough
Specify whether input messages should be passed through as output messages:
+ *Never*: The input messages will never be passed through as output messages.
+ *Always*: The input messages will always be passed through as output messages.
+ *If state changes*: The input messages will only be passed through, when they change the switch state.  Which means that messages containing successive duplicate states, won't be send to the output.

### Input msg
Specify whether input messages should be accepted:
+ *None*: The input messages will never be accepted.
+ *All*: The input messages will always be accepted.

### User input
Specify whether user input (i.e. click and touch events) should be accepted:
+ *Disabled*: The user input will never be accepted.
+ *Enabled and show*: The user input will be accepted, and the new state will be visualized (i.e. the switch will switch to the new state).
+ *Enabled but don't show*: The user input will be accepted, but the new state will not be visualized.  This could be used if the switch needs to show the real state.  As soon as the real state changes, it will be injected into the switch node which will visually switch to the new state.  A ***"ripple" effect*** has been introduced to visualize that another state has been clicked:

   ![multistate_ripple](https://user-images.githubusercontent.com/14224149/131454161-bf63a237-cd62-4bd0-bf2d-9b7f197fb7f1.gif)
   
   Note that only the first time that another state has been clicked, an output message will be sent!

Note that the look and feel of the switch will also change when enabled or not:

![Disabled switch](https://user-images.githubusercontent.com/14224149/109077361-4b2cde80-76fc-11eb-828c-6fcb32caba6d.png)

### Options
Specify the options (label and value) that needs to be displayed inside the switch.

Note that a label can contain an ***icon***.  See [this](https://github.com/bartbutenaers/node-red-contrib-ui-multistate-switch/wiki/Displaying-icons-in-the-switch) wiki page for more information.

### State field
Specify which field in the input and output message will contain the new switch state.  By default `msg.payload` will be used.

### User input field
Specify which field in the input message will contain a value, indicating whether the switch should be enabled or not.  Which means whether it allows user input (click/touch).  By default `msg.enable` will be used.

The content of this message field can be:
+ `"enabled_show"`: see user input modus *"Enabled and show"* for more information.  For legacy reasons, it is also possible to use `true` as content.
+ `"enabled_not_show"`: see user input modus *"Enabled but don't show"* for more information.
+ `"disabled"`: see user input modus *"Disabled"* for more information.  For legacy reasons, it is also possible to use `false` as content.

See example flow in [this](https://github.com/bartbutenaers/node-red-contrib-ui-multistate-switch/wiki/Configuring-the-switch-via-input-messages) wiki page.

### Passthrough field
Specify which field in the input message will contain a value, indicating whether the input messages should be passed through (to the output) or not.  The value can be:
+ `"never"`: see passthrough modus *"Never"* for more information.
+ `"always"`: see passthrough modus *"Allways"* for more information.
+ `"change"`: see passthrough modus *"If state changes"* for more information.

See example flow in [this](https://github.com/bartbutenaers/node-red-contrib-ui-multistate-switch/wiki/Configuring-the-switch-via-input-messages) wiki page.       
    
### Input msg field
Specify which field in the input message will contain a value, indicating whether the input messages should be accepted or not.  The value can be:
+ `"none"`: see input msg modus *"None"* for more information.
+ `"all"`: see input msg modus *"All"* for more information.

See example flow in [this](https://github.com/bartbutenaers/node-red-contrib-ui-multistate-switch/wiki/Configuring-the-switch-via-input-messages) wiki page.

## Example flow

The following flow shows switch button with 2, 3 and 4 states:

![Example flow](https://user-images.githubusercontent.com/14224149/107993849-bb8c7f00-6fdb-11eb-8554-37f1064ce182.png)
```
[{"id":"ddd054f9.fad338","type":"ui_multistate_switch","z":"2b6f5d19.202242","name":"3-state switch","group":"612af469.b217fc","order":2,"width":"6","height":3,"label":"","stateField":"payload","enableField":"enable","rounded":false,"useThemeColors":false,"hideSelectedLabel":false,"options":[{"label":"First","value":"first_option","valueType":"str","color":"#009933"},{"label":"Second","value":"second_option","valueType":"str","color":"#999999"},{"label":"Third","value":"third_option","valueType":"str","color":"#ff6666"}],"x":600,"y":2520,"wires":[["93e957f1.03db98"]]},{"id":"2a536ad0.346656","type":"inject","z":"2b6f5d19.202242","name":"Select first","props":[{"p":"payload"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"first_option","payloadType":"str","x":380,"y":2520,"wires":[["ddd054f9.fad338"]]},{"id":"84299ae7.d19498","type":"inject","z":"2b6f5d19.202242","name":"Select second","props":[{"p":"payload"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"second_option","payloadType":"str","x":390,"y":2560,"wires":[["ddd054f9.fad338"]]},{"id":"ef8b1a83.f3f048","type":"inject","z":"2b6f5d19.202242","name":"Select third","props":[{"p":"payload"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"third_option","payloadType":"str","x":390,"y":2600,"wires":[["ddd054f9.fad338"]]},{"id":"93e957f1.03db98","type":"debug","z":"2b6f5d19.202242","name":"Selected option","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","x":820,"y":2520,"wires":[]},{"id":"824fdffc.d9095","type":"ui_multistate_switch","z":"2b6f5d19.202242","name":"2-state switch","group":"612af469.b217fc","order":2,"width":"6","height":3,"label":"","stateField":"payload","enableField":"enable","rounded":false,"useThemeColors":false,"hideSelectedLabel":false,"options":[{"label":"First","value":"first_option","valueType":"str","color":"#009933"},{"label":"Second","value":"second_option","valueType":"str","color":"#999999"}],"x":600,"y":2400,"wires":[["96211176.fb0c5"]]},{"id":"348a24.23e125dc","type":"inject","z":"2b6f5d19.202242","name":"Select first","props":[{"p":"payload"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"first_option","payloadType":"str","x":380,"y":2400,"wires":[["824fdffc.d9095"]]},{"id":"2d5d1b5f.1ec254","type":"inject","z":"2b6f5d19.202242","name":"Select second","props":[{"p":"payload"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"second_option","payloadType":"str","x":390,"y":2440,"wires":[["824fdffc.d9095"]]},{"id":"96211176.fb0c5","type":"debug","z":"2b6f5d19.202242","name":"Selected option","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","x":800,"y":2400,"wires":[]},{"id":"9e13004b.409cf","type":"ui_multistate_switch","z":"2b6f5d19.202242","name":"4-state switch","group":"612af469.b217fc","order":2,"width":"6","height":3,"label":"","stateField":"payload","enableField":"enable","rounded":false,"useThemeColors":false,"hideSelectedLabel":false,"options":[{"label":"First","value":"first_option","valueType":"str","color":"#009933"},{"label":"Second","value":"second_option","valueType":"str","color":"#999999"},{"label":"Third","value":"third_option","valueType":"str","color":"#ff6666"},{"label":"Fourth","value":"fourth_option","valueType":"str","color":"#009999"}],"x":600,"y":2660,"wires":[["abadd7ac.5a1d68"]]},{"id":"7321b4f6.b4222c","type":"inject","z":"2b6f5d19.202242","name":"Select first","props":[{"p":"payload"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"first_option","payloadType":"str","x":380,"y":2660,"wires":[["9e13004b.409cf"]]},{"id":"92480cff.63557","type":"inject","z":"2b6f5d19.202242","name":"Select second","props":[{"p":"payload"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"second_option","payloadType":"str","x":390,"y":2700,"wires":[["9e13004b.409cf"]]},{"id":"efe7001d.2daa","type":"inject","z":"2b6f5d19.202242","name":"Select third","props":[{"p":"payload"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"third_option","payloadType":"str","x":390,"y":2740,"wires":[["9e13004b.409cf"]]},{"id":"abadd7ac.5a1d68","type":"debug","z":"2b6f5d19.202242","name":"Selected option","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","x":820,"y":2660,"wires":[]},{"id":"a3ea4dcf.9d869","type":"inject","z":"2b6f5d19.202242","name":"Select fourth","props":[{"p":"payload"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"fourth_option","payloadType":"str","x":390,"y":2780,"wires":[["9e13004b.409cf"]]},{"id":"612af469.b217fc","type":"ui_group","name":"Default","tab":"969376dd.5b27e8","order":1,"disp":true,"width":"6","collapse":false},{"id":"969376dd.5b27e8","type":"ui_tab","name":"Switch","icon":"dashboard","disabled":false,"hidden":false}]
```

Some notes about the messages:
+ ***Input msg***: the specified "State" msg field should contain the value of the option that needs to be selected.
+ ***Output msg***: the `msg.payload` will contain the value of the option that has been selected.

## Use cases
A list of possible use cases for this node:

+ Switch a thermostate on/off manually, or put it on automatic mode (i.e. controlled e.g. by a setpoint profile):

   ![thermostat](https://user-images.githubusercontent.com/14224149/107996107-de209700-6fdf-11eb-9ff4-4974e8cbe9bf.png)

+ Switch a light on/off manually, or put it on automatic mode (i.e; controlled by a PIR sensor):

   ![ligth](https://user-images.githubusercontent.com/14224149/107996070-ca753080-6fdf-11eb-96cd-09907673487d.png)

+ Show a larger series of short options:

    ![large series](https://user-images.githubusercontent.com/14224149/108268345-aa26ac80-716c-11eb-9e26-c437d2a243c2.png)
