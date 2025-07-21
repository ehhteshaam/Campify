mapboxgl. accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location 
    center: campground.geometry.coordinates, // starting position [Ing, lat] 
    zoom: 10
});


function escapeHTML(str) {
  return str?.replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
}
map.addControl(new mapboxgl.NavigationControl());
new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML(`
        <h3>${escapeHTML(campground.title || 'No Title')}</h3>
        <p>${escapeHTML(campground.location || 'Location unavailable')}</p>
      `)
  )
  .addTo(map);

