describe('L.Control.MapBoxGeocoder', function() {
    var server;

    beforeEach(function() {
        server = sinon.fakeServer.create();
    });

    afterEach(function() {
        server.restore();
    });

    var json = {
        "query": ["austin"],
        "results": [[{
            "bounds": [-97.9383829999999, 30.098659, -97.5614889999999, 30.516863],
            "lat": 30.3071816,
            "lon": -97.7559964,
            "name": "Austin",
            "score": 600000790107194.8,
            "type": "city",
            "id": "mapbox-places.4201"
        }]]};

    it('performs forward geolocation, centering the map on the first result', function() {
        var map = new L.Map(document.createElement('div')),
            control = new L.Control.MapBoxGeocoder('http://api.tiles.mapbox.com/v3/examples.map-vyofok3q/geocode/{query}.json').addTo(map);

        server.respondWith('GET',
            'http://api.tiles.mapbox.com/v3/examples.map-vyofok3q/geocode/austin.json',
            [200, { "Content-Type": "application/json" }, JSON.stringify(json)]);

        control._input.value = 'austin';
        happen.click(control._submit);
        server.respond();

        expect(map.getCenter()).to.be.near({lat: 30.3, lng: -97.7}, 1e-1);
    });

    it('sets url based on an id', function() {
        var control = new L.Control.MapBoxGeocoder('examples.map-vyofok3q');
        expect(control.url).to.equal('http://a.tiles.mapbox.com/v3/examples.map-vyofok3q/geocode/{query}.json');
    });
});