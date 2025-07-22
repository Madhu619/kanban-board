import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import "./App.css";
import BoardView from "./pages/BoardView";

function App() {
  return (
    <Router>
      <div className="App" data-testid="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/board" element={<BoardView />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
