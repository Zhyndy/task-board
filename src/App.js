import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BoardProvider } from "./context/BoardContext";
import BoardList from "./components/BoardList";
import Board from "./components/Board";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";

function App() {
  return (
    <BoardProvider>
      <Router>
        <div className="app-container">
          <header className="app-header">
            <h1>Task Board</h1>
          </header>
          <Routes>
            <Route path="/" element={<BoardList />} />
            <Route path="/board/:boardId" element={<Board />} />
          </Routes>
        </div>
      </Router>
    </BoardProvider>
  );
}

export default App;
