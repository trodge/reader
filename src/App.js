import React from 'react';
import logo from './logo.svg';
import Inbox from './Inbox.js';
import './App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 style={{ textAlign: "center" }}>
                    Messages
                </h1>
            </header>
            <Inbox />
        </div>
    );
}

export default App;
