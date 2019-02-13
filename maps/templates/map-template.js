document.addEventListener("DOMContentLoaded", function(event) {
    // resize canvas to screen
    function resizeCanvas() {
        $("#container").css({
            "height": window.innerHeight - $("#toolbar").outerHeight(),
            "width": window.innerWidth
        });
    }

    $(window).resize(function() {
        resizeCanvas();
    });

    resizeCanvas();

    // implement message topic event    
    var topic = window.location.pathname.replace('/', '');

    var socket = io();

    socket.on(topic, function(red){
        console.log(red);

        // update chart dataset
        if (red.msg !== undefined) {
            var dataset = {
                label: red.msg.payload.channel,                        
                backgroundColor: red.msg.payload.color,
                borderColor: red.msg.payload.color,
                data: [],
                fill: false
            };

            red.msg.payload.dataset.forEach(item => {
                var position = ol.proj.fromLonLat([item.lon, item.lat]);

                var zoom = 16;
    
                var marker = new ol.Overlay({
                    position: position,
                    positioning: 'center-center',
                    element: document.getElementById('marker'),
                    stopEvent: false
                });
    
                map.addOverlay(marker);
            });
                
            //view.setCenter(position, zoom);
        }

        // update chart configuration
        if (red.config !== undefined) {            
            /*config.options.title.text = red.config.title;

            // refresh chart
            chart.update();*/
        }
      });

   // export event
   $(".dropdown-menu").on("click", "a", function(event) {
        // export to image or pdf file
        if (event.target.id == 'image') {
            /*var link = document.createElement('a');

            link.download = 'image';
            link.href = canvasImg;
            link.click();*/  

            map.once('rendercomplete', function(event) {
                var canvas = event.context.canvas;

                if (navigator.msSaveBlob) {
                  navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
                } else {
                  canvas.toBlob(function(blob) {
                    saveAs(blob, 'map.png');
                  });
                }
            });

            map.renderSync();            
        }
        else {
            var doc = new jsPDF('landscape');

            /*var specialElementHandlers = {
                '#editor': function (element, renderer) {
                    console.log(1);
                    return true;
                }
            };

            doc.fromHTML($('#map').get(0), 15, 15, {
                'width': 170, 
                'elementHandlers': specialElementHandlers
            });

            doc.save('test.pdf');*/
        }
    });

    // set current view
    var view = new ol.View({
        center: ol.proj.fromLonLat([37.41, 8.82]),
        zoom: 4
    });

    // set map configurations
    var config = {
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: view
    };

    // set map
    var map = new ol.Map(config);
});