import React, { Component } from 'react';

class SideNav extends Component {

  render() {
    
    return (
      <div className={`sidenav ${this.props.classNameSidenav}`}>
        <button onClick={this.props.toggleSidenav} className="close-button">&times;</button>
        <h2>Locations</h2>
        <input type='text' className="filter-input" placeholder="Filter Venues" //TODO: Aria
          value={this.props.query} onChange={(event) => { this.props.filterPlaces(event.target.value) }}/>
        <ol className="location-list" >
        {
          this.props.places.map((place, key) => (
           <li className='listelement' key={key}>
            <button onClick={() =>{this.props.listItemClick(place)}} className="listelement-button">{place.name}</button>
           </li>) 
          )
        }
        </ol>
      </div>
    )
  }
}

export default SideNav