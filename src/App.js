import React, { Component } from 'react';
//import locations from './data/locations';
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
    infoBoxes: [],
    places: [],
    query: '',
    filteredPlaces: null
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
      //console.log(infoBoxes)
      this.setState({
        map,
        markers,
        infoBoxes,
        places
      })
    }).catch(err => console.error(err))
  }

  filterPlaces = (query) => {
    let filteredPlaces = query ? this.state.places.filter(place => place.name.toLowerCase().includes(query)) : this.state.places
    console.log(filteredPlaces)
    this.setState({
      query,
      filteredPlaces
    })
  }

  listElemClick = (place) => {

    //console.log(place)
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
          listElemClick={this.listElemClick}
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
