import React, { Component } from 'react';
import './App.css';
import './less/test.less';
import './util/gouzaoqi';
import Home from './pages/Drag/index';
class App extends Component {
  render() {
    return (
      <div className="App">
        <Home/>
      </div>
    );
  }
}

export default App;
