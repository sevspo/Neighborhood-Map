import React, { Component } from 'react';

class SideNav extends Component {

  render() {
    
    return (
      <div className='sidenav'>
        <h2>Locations</h2>
        <input type='text' className="filter-input" placeholder="Filter Venues" //TODO: Aria
          value={this.props.query} onChange={(event) => { this.props.filterPlaces(event.target.value) }}/>
        <ol className="location-list" >
        {
          this.props.places.map((place, key) => <li onClick={() =>{this.props.listItemClick(place)}} key={key}>{place.name}</li>)
        }
        </ol>
      </div>
    )
  }
}

export default SideNav