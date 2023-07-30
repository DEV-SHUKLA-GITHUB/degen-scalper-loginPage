import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegistrationForm from "./RegistrationForm";
import { Provider } from 'react-redux'; 
import store from './store'; 
import LoginForm from "./LoginForm";
import UserDetails from "./UserDetails.jsx";
import UserHome from "./UserHome";
import HomePage from "./HomePage";
import "./App.css"
import TradeDashboard from "./TradeDashboard";

const App = () => {
  return (
    <Provider store={store}>
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<RegistrationForm/>} />
          <Route path="/login" element={<LoginForm/>} />
          <Route path="/userDetails" element={<UserDetails/>} />
          <Route path="/userHome" element={<UserHome/>} />
          <Route path="/tradeDashboard" element={<TradeDashboard/>} />
          <Route path="/" element={<HomePage/>} />
        </Routes>
      </div>
    </Router>
    </Provider>

  );
};

export default App;