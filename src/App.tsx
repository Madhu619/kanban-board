import React, { Suspense } from "react";
import { ThemeProvider } from "./theme/ThemeContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import "./App.css";
import IssueDetail from "./pages/IssueDetail";

const BoardView = React.lazy(() => import("./pages/BoardView"));

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/board"
        element={
          <Suspense fallback={<div>Loading board...</div>}>
            <BoardView />
          </Suspense>
        }
      />
      <Route path="/issue/:id" element={<IssueDetail />} />
    </Routes>
  );
}
function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App" data-testid="App">
          <Navbar />
          <div className="main-layout">
            <div className="main-content">
              <AppRoutes />
            </div>
          </div>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
