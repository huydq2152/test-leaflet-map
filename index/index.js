$(document).ready(function () {
    var previousZoomLevel = 17;
    //#region display map

    const apiKey = "AAPK3373b61cf92b49eaa87fce9d3d4037a5dkWdLy4S9V518BcT_ebYPvh_SUzlx6AmkbdFKnaFrFnetTUR005gMS083ONDA0yU";

    const map = L.map("map").setView([11.338742079290764, 108.89905918790635], previousZoomLevel);
    L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map);

    //#endregion

    //#region Search control
    const searchControl = L.esri.Geocoding.geosearch({
        position: "topright",
        placeholder: "Enter an address or place e.g. 1 York St",
        useMapBounds: false,
        providers: [
            L.esri.Geocoding.arcgisOnlineProvider({
                apikey: apiKey,
                nearby: {
                    lat: -33.8688,
                    lng: 151.2093
                }
            })
        ]
    }).addTo(map);

    const results = L.layerGroup().addTo(map);

    searchControl.on("results", function (data) {
        results.clearLayers();
        for (let i = data.results.length - 1; i >= 0; i--) {
            results.addLayer(L.marker(data.results[i].latlng));
        }
    });
    //#endregion

    //#region Display polygon

    //#region Control that shows pond info on hover

    const info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    info.update = function (props) {
        const contents = props ? `<b>${props.name}</b><br /> Trạng thái: ${props.status} ` : 'Trỏ chuột vào một ao';
        this._div.innerHTML = `<h4>Thông tin ao</h4>${contents}`;
    };

    info.addTo(map);

    //#endregion

    const geojson = L.geoJson(pondDatas, {
        style,
        onEachFeature
    }).addTo(map);

    function style(feature) {
        return {
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7,
            fillColor: getColor(feature.properties.status)
        };
    }

    function onEachFeature(feature, layer) {
        feature.properties.center = layer.getBounds().getCenter();
        layer.on({
            mouseover: mouseoverPond,
            mouseout: mouseoutPond,
            click: clickToPond
        });
        if (feature.properties && feature.properties.name) {
            var label = L.divIcon({
                className: 'pond-label',
                html: `<h2>
                <span 
                class="label label-default" 
                style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); white-space: nowrap;">
                ${feature.properties.name}
                </span>
                </h2>`
            });

            L.marker(feature.properties.center, {
                icon: label
            }).addTo(map);
        }
    }

    function getColor(status) {
        switch (status) {
            case 1:
                return "#FF9980"
            case 2:
                return "#79FF4D"
            default:
                break;
        }
    }

    function mouseoverPond(e) {
        const layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        layer.bringToFront();

        info.update(layer.feature.properties);
    }

    function mouseoutPond(e) {
        const layer = e.target;
        layer.bringToBack();
        geojson.resetStyle(e.target);
        info.update();
    }

    function clickToPond(e) {
        map.fitBounds(e.target.getBounds());
    }

    map.on('zoomend', function () {
        var zoomLever = map.getZoom();
        var differenceZoomLever = zoomLever - previousZoomLevel;
        var previousFontSize = parseFloat($('.pond-label').css('font-size'));
        $('.pond-label').css('font-size', previousFontSize * Math.pow(2, differenceZoomLever));
        previousZoomLevel = zoomLever;
    })

    //#endregion

    $.each(pondDatas.features, function (index, pondData) {
        let fromPond = pondDatas.features.find((pond) => {
            return pond.properties.id == pondData.properties.fromPondId;
        }
        );
        if (fromPond !== null && fromPond !== undefined) {
            var fromPondCenter = fromPond.properties.center;
            L.polyline([fromPondCenter, pondData.properties.center]).arrowheads({
                frequency: '40px', 
                size: '12px',
                zIndex:100
            }).addTo(map);
        }
    })
});

