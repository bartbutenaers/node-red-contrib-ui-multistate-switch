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

1. Specify all the available options in the config screen:

   ![Config screen](https://user-images.githubusercontent.com/14224149/108125938-79ca0a00-70a9-11eb-8b0b-4f714ddcab93.png)
   
   The ***label*** is the text that will be displayed, while the ***value*** will be used in the input and output messages.

2. These options will be displayed in the dashboard:

   ![mult_switch_demo](https://user-images.githubusercontent.com/14224149/108126201-da594700-70a9-11eb-8587-5cc11516ae4a.gif)

   As soon as a button is clicked, it's value will be send in the `msg.payload` of the output message.
   
 3. It is also possible to inject an input message, with the new value in the `msg.payload`.  The corresponding option will automatically be selected in the dashboard.

## Example flow

The following flow shows switch button with 2, 3 and 4 states:

![Example flow](https://user-images.githubusercontent.com/14224149/107993849-bb8c7f00-6fdb-11eb-8554-37f1064ce182.png)
```
[{"id":"cad2fee2.d0e9a","type":"ui_mult_state_switch","z":"2b6f5d19.202242","name":"3-state switch","group":"612af469.b217fc","order":2,"width":"6","height":3,"options":[{"label":"First","value":"first_option","valueType":"str"},{"label":"Second","value":"second_option","valueType":"str"},{"label":"Third","value":"third_option","valueType":"str"}],"x":400,"y":2220,"wires":[["204b263a.64c4ea"]]},{"id":"2f9978f4.c5c708","type":"inject","z":"2b6f5d19.202242","name":"Select first","props":[{"p":"payload"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"first_option","payloadType":"str","x":180,"y":2220,"wires":[["cad2fee2.d0e9a"]]},{"id":"d0d75a6b.688648","type":"inject","z":"2b6f5d19.202242","name":"Select second","props":[{"p":"payload"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"second_option","payloadType":"str","x":190,"y":2260,"wires":[["cad2fee2.d0e9a"]]},{"id":"ec5eea26.350f68","type":"inject","z":"2b6f5d19.202242","name":"Select third","props":[{"p":"payload"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"third_option","payloadType":"str","x":190,"y":2300,"wires":[["cad2fee2.d0e9a"]]},{"id":"204b263a.64c4ea","type":"debug","z":"2b6f5d19.202242","name":"Selected option","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","x":620,"y":2220,"wires":[]},{"id":"9e1ef6a4.789a78","type":"ui_mult_state_switch","z":"2b6f5d19.202242","name":"2-state switch","group":"612af469.b217fc","order":2,"width":"6","height":3,"options":[{"label":"First","value":"first_option","valueType":"str"},{"label":"Second","value":"second_option","valueType":"str"}],"x":400,"y":2100,"wires":[["f5052e2b.ebb15"]]},{"id":"5f12e1c3.2fc9c","type":"inject","z":"2b6f5d19.202242","name":"Select first","props":[{"p":"payload"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"first_option","payloadType":"str","x":180,"y":2100,"wires":[["9e1ef6a4.789a78"]]},{"id":"bfe7e4fe.173e28","type":"inject","z":"2b6f5d19.202242","name":"Select second","props":[{"p":"payload"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"second_option","payloadType":"str","x":190,"y":2140,"wires":[["9e1ef6a4.789a78"]]},{"id":"f5052e2b.ebb15","type":"debug","z":"2b6f5d19.202242","name":"Selected option","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","x":600,"y":2100,"wires":[]},{"id":"dba495.71ba6b68","type":"ui_mult_state_switch","z":"2b6f5d19.202242","name":"4-state switch","group":"612af469.b217fc","order":2,"width":"6","height":3,"options":[{"label":"First","value":"first_option","valueType":"str"},{"label":"Second","value":"second_option","valueType":"str"},{"label":"Third","value":"third_option","valueType":"str"},{"label":"Fourth","value":"fourth_option","valueType":"str"}],"x":400,"y":2360,"wires":[["b2c354b7.91a278"]]},{"id":"a8af40bb.3ab29","type":"inject","z":"2b6f5d19.202242","name":"Select first","props":[{"p":"payload"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"first_option","payloadType":"str","x":180,"y":2360,"wires":[["dba495.71ba6b68"]]},{"id":"92caac75.e96de","type":"inject","z":"2b6f5d19.202242","name":"Select second","props":[{"p":"payload"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"second_option","payloadType":"str","x":190,"y":2400,"wires":[["dba495.71ba6b68"]]},{"id":"7babbe84.20f2f","type":"inject","z":"2b6f5d19.202242","name":"Select third","props":[{"p":"payload"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"third_option","payloadType":"str","x":190,"y":2440,"wires":[["dba495.71ba6b68"]]},{"id":"b2c354b7.91a278","type":"debug","z":"2b6f5d19.202242","name":"Selected option","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","x":620,"y":2360,"wires":[]},{"id":"8b3e3285.223a2","type":"inject","z":"2b6f5d19.202242","name":"Select fourth","props":[{"p":"payload"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"fourth_option","payloadType":"str","x":190,"y":2480,"wires":[["dba495.71ba6b68"]]},{"id":"612af469.b217fc","type":"ui_group","z":"","name":"Default","tab":"969376dd.5b27e8","order":1,"disp":true,"width":"6","collapse":false},{"id":"969376dd.5b27e8","type":"ui_tab","z":"","name":"Switch","icon":"dashboard","disabled":false,"hidden":false}]
```

Some notes about the messages:
+ ***Input msg***: the `msg.payload` should contain the value of the option that needs to be selected.
+ ***Output msg***: the `msg.payload` will contain the value of the option that has been selected.

## Use cases
A list of possible use cases for this node:

+ Switch a thermostate on/off manually, or put it on automatic mode (i.e. controlled e.g. by a setpoint profile):

   ![thermostat](https://user-images.githubusercontent.com/14224149/107996107-de209700-6fdf-11eb-9ff4-4974e8cbe9bf.png)

+ Switch a light on/off manually, or put it on automatic mode (i.e; controlled by a PIR sensor):

   ![ligth](https://user-images.githubusercontent.com/14224149/107996070-ca753080-6fdf-11eb-96cd-09907673487d.png)
