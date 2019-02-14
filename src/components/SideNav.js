import React, { Component } from 'react';

class SideNav extends Component {

  render() {
    return (
      <section role='navigation' className={`sidenav ${this.props.classNameSidenav}`}>
        <button aria-label="close sidebar" onClick={this.props.toggleSidenav} className="close-button">&times;</button>
        <h2>Places</h2>
        <input type='text' aria-label="search places" className="filter-input" placeholder="Filter Places"
          value={this.props.query} onChange={(event) => { this.props.filterPlaces(event.target.value) }}/>
        <ul className="location-list" >
        {
          this.props.places.map((place, key) => (
           <li className='listelement' key={key}>
            <button onClick={() =>{this.props.listItemClick(place)}} className="listelement-button">{place.name}</button>
           </li>) 
          )
        }
        </ul>
        <p className="place-attribution">venue reccomendations and pictures provided by <a href="https://foursquare.com/de">Foursquare</a></p>
      </section>
    )
  }
}

export default SideNav