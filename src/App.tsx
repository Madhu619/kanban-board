import React from "react";
import Navbar from "./components/Navbar/Navbar";
import DummyComponent from "./components/DummyComponent/DummyComponent";
import Footer from "./components/Footer/Footer";
import "./App.css";

function App() {
  return (
    <div className="App" data-testid="App">
      <Navbar />
      <h1>
        {" "}
        Let's build a Kanban-Style Issue Board with React and TypeScript!{" "}
      </h1>
      <DummyComponent />
      <Footer />
    </div>
  );
}

export default App;
