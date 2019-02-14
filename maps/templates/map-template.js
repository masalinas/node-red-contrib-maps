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
            // initialize layer collections            
            var vectorSource = new ol.source.Vector({});

            // create layer from all channels and items dataset
            red.msg.payload.forEach(channel => {
                channel.dataset.forEach(item => {                                        
                    // create item marker
                    var position = ol.proj.fromLonLat([item.lon, item.lat]);
    
                    var feature = new ol.Feature({geometry: new ol.geom.Point(position)});
                    
                    feature.setStyle(new ol.style.Style({
                        image: new ol.style.Icon({
                          color: item.color,
                          crossOrigin: 'anonymous',
                          src: 'marker.png'
                        })
                    }));
                    
                    feature.set('description', item.description);
                    feature.set('value', item.value);
                    feature.set('unit', item.unit);

                    // add marker to layer
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

            // create a Select interaction and add it to the map
            /*var select = new ol.interaction.Select({
                layers: [vectorLayer],
                style: selectedStyle
            });
                                
            map.addInteraction(select);*/

            // fit to extend points in the map
            map.getView().fit(vectorLayer.getSource().getExtent(), map.getSize());
        }

        // update chart configuration
        if (red.config !== undefined) {            
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

    // get map element
    var map = new ol.Map(config);

    // change pointer over markers
    map.on('pointermove', function(e) {
        if (e.dragging) {
          $(elementPopUp).popover('dispose');

          return;
        };

        var pixel = map.getEventPixel(e.originalEvent);
        var hit = map.hasFeatureAtPixel(pixel);

        var target = map.getTarget();
        var jTarget = typeof target === "string" ? $("#" + target) : $(target);

        if (hit)
            jTarget.css("cursor", "pointer");
        else 
            jTarget.css("cursor", "");
    });

    // display popup on click
    map.on('click', function(evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature;
        });

        if (feature) {
            var coordinates = feature.getGeometry().getCoordinates();

            var description = feature.get('description');
            var value = feature.get('value');            
            var unit = feature.get('unit');            

            // add item popup
            var popup = new ol.Overlay({
                element: elementPopUp,
                positioning: 'bottom-center',
                stopEvent: false,
                offset: [0, -20]
            });

            // remove all overlies add the new one
            map.getOverlays().getArray().slice(0).forEach(function(overlay) {
                map.removeOverlay(overlay);
            });

            map.addOverlay(popup);

            // set popup position and show
            popup.setPosition(coordinates);

            $(elementPopUp).popover('dispose');

            var content;
            if (description)
                content = description;
            if (value)
                content = content + '<p>' + value;
            if (unit)
                content = content + unit;

            $(elementPopUp).popover({
                placement: 'top',
                html: true,
                content: content
            });
            
            $(elementPopUp).popover('show')
        }
        else         
            $(elementPopUp).popover('dispose');
    });

    // get map popup element
    var elementPopUp = document.getElementById('popup');
});