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
            // initialize layer collection
            vectorLayers = [];
            
            var vectorSource = new ol.source.Vector({});

            red.msg.payload.forEach(channel => {
                channel.dataset.forEach(item => {                                        
                    // get item position
                    var position = ol.proj.fromLonLat([item.lon, item.lat]);
    
                    // get item marker
                    var feature = new ol.Feature({geometry: new ol.geom.Point(position)});
                    feature.setStyle(new ol.style.Style({
                        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                          color: '#8959A8',
                          crossOrigin: 'anonymous',
                          src: 'https://openlayers.org/en/v4.6.5/examples/data/dot.png'
                        }))
                    }));
    
                    vectorSource.addFeature(feature);               
                });
            });
                        
            // create vector layer from all positions
            var vectorLayer = new ol.layer.Vector({
                source: vectorSource,
                updateWhileAnimating: true,
                updateWhileInteracting: true,
                /* style: function(feature, resolution) {
                    iconStyle.getImage().setScale(map.getView().getResolutionForZoom(18) / resolution);
                    return iconStyle; 
                } */
            });

            // add layer to map
            map.addLayer(vectorLayer); 

            // fit to extend points in the map
            map.getView().fit(vectorLayer.getSource().getExtent(), map.getSize());
        }

        // update chart configuration
        if (red.config !== undefined) {            
            /*config.options.title.text = red.config.title;

            // refresh chart
            chart.update();*/
        }
      });

   // export event implementation
   $(".dropdown-menu").on("click", "a", function(event) {
        // export to image or pdf file
        if (event.target.id == 'image') {
            map.once('rendercomplete', function(event) {
                var canvasImg = event.context.canvas;

                var link = document.createElement('a');

                link.download = 'image';
                link.href = canvasImg.toDataURL('image/png');
                link.click();
            });

            map.renderSync();            
        }
        else {
            map.once('rendercomplete', function(event) {
                var canvasImg = event.context.canvas;

                // A4 format
                var size = map.getSize();
                var extent = map.getView().calculateExtent(size);

                var pdf = new jsPDF('landscape', undefined, 'a4');

                pdf.addImage(canvasImg.toDataURL('image/jpeg'), 'JPEG', 0, 0, 297, 210 );
                pdf.save('map.pdf');
            });

            map.renderSync();
        }
    });

    // set map configurations
    var config = {
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([37.41, 8.82]),
            zoom: 4
        })
    };

    // set map
    var map = new ol.Map(config);
});