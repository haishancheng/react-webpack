import React from "react";
import "./App.scss";
import background from "./assets/images/test.jpg";

function App() {
  return (
    <div className="App">
      <h1 className="text">Hello Webpack</h1>
      <img className="background" src={background} alt="" />
    </div>
  );
}

export default App;
