# Tide Walker

This app is intended to facilitate access to the intertidal zone, in areas with extreme tides.
The initial use case and inspiration for the app is to plan tourism visitation of the dinosaur footprints in Broome, Western Australia.
The surviving footprints are mostly located in the intertidal zone.

## Live Demo
The app is live at
https://www.tidewalker.com.au/

## Architecture

The app has a frontend built using Angular, and makes heavy use of the mapbox-gl.js mapping API.
NGXS is used for state management. In the live demo, the frontend is running on GCP AppEngine, a PAAS solution.

The backend is Geoserver running on a GCP Compute Engine instance.
This is communicated with using OGC standard WMS and WFS requests directly from the Angular frontend.
The Geoserver REST API is not used, as this is intended for configuration only, not serving spatial data.
The WorldTides API is also used, to obtain tide height values. This is a paid service.

The GCP Geoserver instance sits behind a GCP HTTPS Load Balancer. This is a convenient and secure way to enable HTTPS encryption for the server. HTTPS encryption is necessary, because it is important for the TideWalker app to be able to use device geolocation - this is disabled under HTTP.

