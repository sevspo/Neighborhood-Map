import React, { Component } from 'react';
import locations from './data/locations';
import * as helpers from './helperFunc.js'
import Map from './components/Map';
import SideNav from './components/SideNav'
import './App.css';

class App extends Component {
  state = {
    center: {lat: 46.94809, lng: 7.44744},
    zoom: 13,
    //locations: locations,
    map: null,
    markers: [],
    infoBoxes: []
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
          //index: place.index,
          name: place.name,
          animation: google.maps.Animation.DROP,
          visible: true,
          //icon:
        })
        let infoWindowContent = `<div>${marker.name}</div>`
        marker.addListener('click', () => {
          infoWindow.marker = marker
          infoWindow.setContent(infoWindowContent)
          infoWindow.open(map, marker)
        })
        markers.push(marker)
        infoBoxes.push({index: place.index, name: place.name, content: infoWindowContent})
      })
      console.log(infoBoxes)
      this.setState({
        map,
        markers,
        infoBoxes
      })
    }).catch(err => console.error(err))
  }

  populateInfoWindow(marker) {
    console.log(marker)
  }

  render() {
    //console.log(this.state.markers, this.state.map)
    return (
      <div className="App">
        <header className="App-header">
          <h1>My Neighborhood</h1>
        </header>
        <Map/>
        <SideNav 
          onClick={this.populateInfoWindow}
          markers={this.state.markers}
          //locations={this.state.locations}
        />
      </div>
    );
  }
}

export default App;
