import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './less/test.less';
import './util/gouzaoqi';
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro container" >
          To get started, edit <code className='box'>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
