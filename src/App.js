import React, { Component } from 'react';
import * as helpers from './helperFunc.js'
import Map from './components/Map';
import SideNav from './components/SideNav';
import './App.css';

class App extends Component {
  state = {
    center: {lat: 46.94809, lng: 7.44744},
    zoom: 14,
    map: null,
    markers: [],
    infoWindow: null,
    places: [],
    query: '',
    filteredPlaces: null,
    sideNavOpen: 'open',
    google: null,
    activeMarker: null
  }
  /* In this method we do:
  * 1. Call out to both API's to get the map and also the places.
  * 2. We create a Map instance and pass it our center and zoom
  * 3. We create Markers for each place
  * 4. We store that data in the state*/
  componentDidMount() {
    const googleMapsPromise = helpers.getGoogleMaps()
    const fqPlacesPromise = helpers.getFourSquarePlaces()
    Promise.all([
      //Catching a possible error here will prevent rejecting both promises!
      //So the map still shows when Foursuqare is not reachable and vice versa\
      //We also inform the User about what went wrong
      googleMapsPromise.catch(err => {
        alert('We are sorry, but Google Maps services are not available at the moment!');
        console.error('Google Maps Error: ' + err);
      }),
      fqPlacesPromise.catch(err => {
        alert('We are sorry, but Foursquare services are not available at the moment');
        console.error('Foursqare API Error: ' + err);
      })
    ]).then(values => {
      const google = values[0];
      const places = values[1];
      const markers = [];
      const infoWindow = new google.maps.InfoWindow();
      const map = new google.maps.Map(document.getElementById('map'), {
        center: this.state.center,
        zoom: this.state.zoom,
        mapTypeControl: false,
      });
      places.forEach(place => {
        let marker = new google.maps.Marker({
          position: { lat: place.lat, lng: place.lng },
          map: map,
          index: place.index,
          name: place.name,
          placeID: place.fsID,
          animation: google.maps.Animation.DROP,
          visible: true,
        });
        marker.addListener('click', () => {
          this.createInfowindow(marker)
        });
        markers.push(marker)
      })
      this.setState({
        map,
        markers,
        places,
        infoWindow,
        google
      });
      //But we still need to catch the undefinded error here if one of the API's does not load.
    }).catch(err => console.error('Main Promise Error: ' + err));
  }
  /* Filter the Places if a query is entered into the sarch input
  * and filter the visible Markers */
  filterPlaces = (query) => {
    //first close any open infowindow
    let closeInfowindow = this.state.infoWindow;
    closeInfowindow.close();
    let filteredMarkers = this.state.markers;
    //if there is query, compare it to all places and return all that match
    //the includes mehtod in this case is very suitable to do the job
    let filteredPlaces = query ? this.state.places.filter(place => place.name.toLowerCase().includes(query.toLowerCase())) : this.state.places;
    //also match all the markers to the query to only show those that match
    filteredMarkers.forEach(marker => {
      marker.name.toLowerCase().includes(query.toLowerCase()) ? marker.setVisible(true) : marker.setVisible(false);
    });
    this.setState({
      query,
      filteredPlaces,
      markers: filteredMarkers,
      infoWindow: closeInfowindow
    });
  }
  /* Match the marker to a selected place  */
  listItemClick = (place) => {
    let selectedMarker = this.state.markers.filter(marker => marker.index === place.index)[0];
    this.createInfowindow(selectedMarker);
  }
  /* Call the Foursquare API to get the Image URL for the Marker 
  * Create the infowindow and call the marker to attach it 
  * Also set the Animation of of an active marker to 0 */
  createInfowindow = (marker) => {
    if (this.state.activeMarker !== null) {
      this.state.activeMarker.setAnimation(null);
    }
    helpers.getFourSquareImages(marker.placeID)
      .then(res => {
        if (res === '') {
        let infoWindowContent = `<div class='info-box'>
        <h3 class='infobox-title'>${marker.name}</h3>
        <p>No Image available</p>
        <img alt='${marker.name}' src='${res}'/>
        </div>`
        this.showMarker(marker, infoWindowContent)
        } else {
        let infoWindowContent = `<div class='info-box'>
        <h3 class='infobox-title'>${marker.name}</h3>
        <img alt='${marker.name}' src='${res}'/>
        </div>`
        this.showMarker(marker, infoWindowContent)
      }
      })
  }

  /* Show the marker of a selected Place
   * Show the infowindow of the selected Place
   * Set it's content
   * Animate the marker */
  showMarker = (marker, infoWindowContent) => {
    let updatedInfoWindow = this.state.infoWindow;
    updatedInfoWindow.marker = marker;
    updatedInfoWindow.setContent(infoWindowContent);
    updatedInfoWindow.open(this.state.map, marker);
    if (marker.getAnimation() !== null) {
       marker.setAnimation(null);
    } else {
      marker.setAnimation(this.state.google.maps.Animation.BOUNCE);
    }
    setTimeout(() => { marker.setAnimation(null) }, 1500);
    this.setState({
      infoWindow: updatedInfoWindow,
      activeMarker: marker
    });
  }

  toggleSidenav = () => {
    let toggle = this.state.sideNavOpen === 'open' ? 'hidden' : 'open';
    this.setState({
      sideNavOpen: toggle
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <button aria-label='open sidebar' onClick={this.toggleSidenav} className="open-button">&#9776;</button>
          <h1>My Neighborhood</h1>
        </header>
        <SideNav
          toggleSidenav={this.toggleSidenav}
          classNameSidenav={this.state.sideNavOpen}
          listItemClick={this.listItemClick}
          places={this.state.filteredPlaces ? this.state.filteredPlaces: this.state.places}
          filterPlaces={this.filterPlaces}
          query={this.state.query}
        />
        <Map/>
      </div>
    )
  }
}
export default App;
