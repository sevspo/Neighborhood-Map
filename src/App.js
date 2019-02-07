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
    locations: locations,
    map: null,
    markers: [],
    infoWindow: null
  }

  componentDidMount() {
    helpers.getGoogleMaps()
    .then((google) => {
      //console.log(this.state.locations);
      const markers = [];
      const infoWindow = new google.maps.InfoWindow();
      const map = new google.maps.Map(document.getElementById('map'), {
        center: this.state.center,
        zoom: this.state.zoom,
        //styles: styles,
        //mapTypeControl: false
      });
      for (var i = 0; i < this.state.locations.length; i++) {
        // Get the position from the location array.
        let position = this.state.locations[i].pos;
        let title = this.state.locations[i].title;
        // Create a marker per location, and put into markers array.
        let marker = new google.maps.Marker({
          position: position,
          title: title,
          map: map,
          animation: google.maps.Animation.DROP,
          //icon: defaultIcon,
          id: i,
          //visible: false
        });

        
        

        markers.push(marker)
        //console.log(this)

      }
      this.setState({
        map,
        markers,
        infoWindow
      })
    })
    helpers.getFourSquarePlaces()
    .then(res => {
      console.log(res)
      let venueNames = res.map(e => e.venue.name)
      console.log(venueNames)
      let venues = []
      res.forEach(e => {
        let obj = { 
          venue: e.venue.name,
          lat: e.venue.location.lat,
          lng: e.venue.location.lng
        }
        venues.push(obj)
      })
      console.log(venues)

    })
    .catch(err => console.error(err))
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
          locations={this.state.locations}
        />
      </div>
    );
  }
}

export default App;
