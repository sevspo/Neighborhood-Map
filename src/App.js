import React, { Component } from 'react';
//import locations from './data/locations';
import * as helpers from './helperFunc.js'
import Map from './components/Map';
import SideNav from './components/SideNav'
import './App.css';

class App extends Component {
  state = {
    center: {lat: 46.94809, lng: 7.44744},
    zoom: 14,
    //locations: locations,
    map: null,
    markers: [],
    infoBoxes: [],
    infoWindow: null,
    places: [],
    query: '',
    filteredPlaces: null,
    sideNavOpen: 'open'
  }

  componentDidMount() {
    const googleMapsPromise = helpers.getGoogleMaps()
    const fqPlacesPromise = helpers.getFourSquarePlaces()
    Promise.all([
      googleMapsPromise,
      fqPlacesPromise
    ]).then(values => {
      const google = values[0]
      const places = values[1]
      const markers = []
      const infoBoxes = []
      const infoWindow = new google.maps.InfoWindow();
      const map = new google.maps.Map(document.getElementById('map'), {
        center: this.state.center,
        zoom: this.state.zoom,
        //styles: styles,
        mapTypeControl: false,
        //scrollwheel: true
      });
      places.forEach(place => {
        let marker = new google.maps.Marker({
          position: { lat: place.lat, lng: place.lng },
          map: map,
          index: place.index,
          name: place.name,
          animation: google.maps.Animation.DROP,
          visible: true,
          //icon:
        })
        let infoWindowContent = `<div class='info-box'>
        <h3 class='infobox-title'>${marker.name}</h3>
        <img alt='${marker.name}' src='${place.photoURL}'/>
        </div>`
        marker.addListener('click', () => {
          this.showInfoWindow(marker, infoWindowContent)
        })
        markers.push(marker)
        infoBoxes.push({index: place.index, name: place.name, content: infoWindowContent})
      })
      //console.log(infoBoxes)
      this.setState({
        map,
        markers,
        infoBoxes,
        places,
        infoWindow
      })
    }).catch(err => console.error('Error Main Promise: ' + err))
  }
  
  filterPlaces = (query) => {
    let closeInfowindow = this.state.infoWindow
    closeInfowindow.close()
    let filteredMarkers = this.state.markers
    let filteredPlaces = query ? this.state.places.filter(place => place.name.toLowerCase().includes(query.toLowerCase())) : this.state.places
    filteredMarkers.forEach(marker => {
      marker.name.toLowerCase().includes(query.toLowerCase()) ? marker.setVisible(true) : marker.setVisible(false);
    })
    this.setState({
      query,
      filteredPlaces,
      markers: filteredMarkers,
      infoWindow: closeInfowindow
    })
  }

  showInfoWindow = (marker, infoWindowContent) => {
    let updatedInfoWindow = this.state.infoWindow
    updatedInfoWindow.marker = marker
    updatedInfoWindow.setContent(infoWindowContent)
    updatedInfoWindow.open(this.state.map, marker)
    if (marker.getAnimation() !== null) {
       marker.setAnimation(null);
    } else {
      marker.setAnimation(this.google.maps.Animation.BOUNCE);
    }
    setTimeout(() => { marker.setAnimation(null) }, 1500);
    this.setState({
      infoWindow: updatedInfoWindow
    })
  }

  listItemClick = (place) => {
    //console.log(place)
    let selectedMarker = this.state.markers.filter(marker => marker.index === place.index)[0]
    let selectedInfobox = this.state.infoBoxes.filter(infoBox => infoBox.index ===place.index)[0]
    this.showInfoWindow(selectedMarker, selectedInfobox.content)
  }

  toggleSidenav = () => {
    let toggle = this.state.sideNavOpen === 'open' ? 'hidden' : 'open'
    this.setState({
      sideNavOpen: toggle
    })
  }

  render() {
    //console.log(this.state.markers, this.state.map)
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={this.toggleSidenav} className="close-button">&#9776;</button>
          <h1>My Neighborhood</h1>
        </header>
        <Map/>
        <SideNav
          toggleSidenav={this.toggleSidenav}
          classNameSidenav={this.state.sideNavOpen}
          listItemClick={this.listItemClick}
          places={this.state.filteredPlaces ? this.state.filteredPlaces: this.state.places}
          filterPlaces={this.filterPlaces}
          query={this.state.query}
          //locations={this.state.locations}
        />
      </div>
    );
  }
}

export default App;
