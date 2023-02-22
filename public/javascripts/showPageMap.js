mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: restaurant.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(restaurant.geometry.coordinates)
    .addTo(map)