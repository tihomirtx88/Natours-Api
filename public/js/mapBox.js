document.addEventListener('DOMContentLoaded', () => {

  const mapElement = document.getElementById('map');
  
  if (!mapElement) {
    console.error('Map element not found');
    return;
  }

  // Check if dataset.locations is defined
  const locationsData = mapElement.dataset.locations;
  const locations = locationsData ? JSON.parse(locationsData) : [];

  console.log('Parsed locations:', locations);

  // Mapbox access token
  mapboxgl.accessToken =
    'pk.eyJ1IjoidGlob21pcnR4ODgiLCJhIjoiY2x6Zm56aHM2MG9scTJxczhncmdmYTdsdCJ9.j58GCkLB_4iTCvBIKINBeA';

  // Default coordinates
  const defaultCoordinates = [27.910543, 43.204666];

  // Initialize map
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/tihomirtx88/clzfox4p200dc01prb4f10xij', // style URL,
    scrollZoom: false
  });

  // Create a bounds object
  const bounds = new mapboxgl.LngLatBounds();

  // Add markers and extend bounds
  locations.forEach(loc => {
    let coordinates = loc.coordinates;

    // Use default coordinates if the coordinates are invalid or missing
    if (
      !coordinates ||
      !Array.isArray(coordinates) ||
      coordinates.length !== 2
    ) {
      console.warn(
        'Invalid or missing coordinates. Using default coordinates:',
        loc
      );
      coordinates = defaultCoordinates;
    } else {
      console.log('Location coordinates:', coordinates);
    }

    // Create marker element
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker to map
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend bounds
    bounds.extend(coordinates);
  });

  // Fit map to bounds
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    },
    maxZoom: 12 // Adjust this value to set the desired maximum zoom level
  });
});
