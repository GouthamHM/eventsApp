import React from "react";

import Calendar from "./components/Calendar.jsx";

import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header>
          <div id="title">
            <span>
              Events App
            </span>
          </div>
        </header>
        <main>
          <Calendar />
        </main>
      </div>
    );
  }
}

export default App;
