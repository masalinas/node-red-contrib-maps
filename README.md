# node-red-contrib-chartjs
Maps Node-RED node implemented by Openlayers 5

![Node-RED Maps Dashboard](![node_maps](https://user-images.githubusercontent.com/1216181/52797842-0256df80-3077-11e9-8731-d54fb152eb2d.png)
)

## Description
This node package permit to use [Openlayers](https://openlayers.org/) **map** from Node-RED. The objective is create a new url for the map created, this url path could be configured and updated at runtime.

For the latest updates see the [CHANGELOG.md](https://github.com/masalinas/node-red-contrib-maps/blob/master/CHANGELOG.md)

## Installation
```
npm install node-red-contrib-maps --save
```

## Map configuration
The **Map attributes** are:
* Path: The Map Url to be access. An example where path is MAP could be:
```
http://localhost:1880/MAP
```

* Tittle: The map title
* Payload: The map dataset object

The **map payload attributes** are:
* channel: The channel legend
* color: The map makers
* dataset: The map dataset

The **payload dataset attributes** are:
* lon: longitude point
* lat: latitude point
* value: value point
* description: descripion value

Read node help to check the dataset structure for each chart.
A Europe Temperature Map dataset could be like this:
```
{
    "channel": "TEMP",
    "color": "Red",
    "dataset": [
        {
            "lon": -3.707698,
            "lat": 23.8,
            "value": 20.5,
            "description": "Temperature [°C] in Madrid"
        },
        {
            "lon": 2.34294,
            "lat": 21.25,
            "value": 20.5,
            "description": "Temperature [°C] in London"
        },
        {
            "lon": 2.34294,
            "lat": 48.859271,
            "value": 19.7,
            "description": "Temperature [°C] in Paris"
        },
        {
            "lon": 13.402786,
            "lat": 52.517987,
            "value": 10.8,
            "description": "Temperature [°C] in Berlin"
        }
    ]
}
```

## Dependencies
### Server side
* [socker.io](https://github.com/socketio/socket.io): socket.io server side
* [serve-static](https://github.com/expressjs/serve-static): Serve static files
* [cors](https://github.com/expressjs/cors): Node.js CORS middleware

### Client side
* [socker.io-client](https://github.com/socketio/socket.io-client): Socket.io client side
* [jquery](https://github.com/jquery/jquery): Multipurpose javascript library
* [bootstrap4](https://getbootstrap.com/): Build responsive, mobile-first projects on the web
* [popper.js](https://popper.js.org/): A kickass library used to manage poppers in the web applications
* [Openlayers](https://openlayers.org/): OpenLayers makes it easy to put a dynamic map in any web page
developers
* [jsPDF](https://parall.ax/products/jspdf): The leading HTML5 client solution for generating PDFs 

## Example
Under example folder you have a json flow to be imported in your node-red instance to test the nodes.