import React, { Component } from 'react';

class SideNav extends Component {

  render() {
    //console.log(this.props.locations)
    return (
      <div className='sidenav'>
        <h2>Locations</h2>
        <ol className="location-list" >
        {
          this.props.markers.map((marker, key) => <li onClick={() =>{this.props.onClick(marker)}} key={key}>{marker.name}</li>)
        }
        </ol>
      </div>
    )
  }
}

export default SideNav