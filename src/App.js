import React, { Component } from 'react';
import Map from './components/Map'
import './App.css';

class App extends Component {
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>My Neighborhood</h1>
        </header>
        <Map/>
      </div>
    );
  }
}

export default App;
