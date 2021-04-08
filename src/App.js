import React from "react";
import { Router } from "@reach/router";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Assignments from "./pages/Assignments";
import Events from "./pages/Events";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";

function App() {
  return (
    <>
      <Navbar />
      <Router>
        <Home path='/' />
        <About path='/about' />
        <Assignments path='/assignments' />
        <Events path='/calendar' />
        <Calendar path='/testCal' />
      </Router>
    </>
  );
}

export default App;
