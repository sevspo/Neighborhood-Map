import React, { Component } from 'react';
import locations from './data/locations';
import * as helpers from './helperFunc.js'
import Map from './components/Map';
import SideNav from './components/SideNav'
import './App.css';

class App extends Component {
  state = {
    center: {lat: 46.954578, lng: 7.469964},
    zoom: 13,
    locations: locations
  }

  componentDidMount() {
    helpers.getGoogleMaps()
    .then((google) => {
      console.log(this.state.locations);
      this.map = new google.maps.Map(document.getElementById('map'), {
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
        this.marker = new google.maps.Marker({
          position: position,
          title: title,
          map: this.map,
          animation: google.maps.Animation.DROP,
          //icon: defaultIcon,
          id: i
        });
      }
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>My Neighborhood</h1>
        </header>
        <Map/>
        <SideNav/>
      </div>
    );
  }
}

export default App;
