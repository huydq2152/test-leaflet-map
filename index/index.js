$(document).ready(function () {
    const apiKey = "AAPK3373b61cf92b49eaa87fce9d3d4037a5dkWdLy4S9V518BcT_ebYPvh_SUzlx6AmkbdFKnaFrFnetTUR005gMS083ONDA0yU";

    const map = L.map("map").setView([11.338742079290764, 108.89905918790635], 18);
    L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map);

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
        const contents = props ? `<b>${props.name}</b><br /> Trạng thái: ${props.status} `: 'Trỏ chuột vào một ao';
        this._div.innerHTML = `<h4>Thông tin ao</h4>${contents}`;
    };

    info.addTo(map);

    //#endregion

    const geojson = L.geoJson(pondData, {
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
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
        if (feature.properties && feature.properties.name) {
            var label = L.divIcon({
                className: 'my-label',
                html: feature.properties.name
            });

            L.marker(layer.getBounds().getCenter(), {
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

    function highlightFeature(e) {
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

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    //#endregion

});

