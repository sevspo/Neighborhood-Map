import React, { Component } from 'react';
/*  This is the map Component, for the sake of proper refactoring  */
class Map extends Component {
  render() {
    return (
      <main role='application' aria-label="map">
        <div id="map"></div>
      </main>
    )
  }
}
export default Map