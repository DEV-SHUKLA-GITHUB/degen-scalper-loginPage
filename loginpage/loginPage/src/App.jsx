import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";
import UserDetails from "./UserDetails.jsx";
import UserHome from "./UserHome";
import HomePage from "./HomePage";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<RegistrationForm/>} />
          <Route path="/login" element={<LoginForm/>} />
          <Route path="/userDetails" element={<UserDetails/>} />
          <Route path="/userHome" element={<UserHome/>} />
          <Route path="/" element={<HomePage/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;