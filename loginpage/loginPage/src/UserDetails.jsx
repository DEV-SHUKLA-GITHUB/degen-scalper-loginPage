import React, { useEffect, useState } from "react";

export default function UserDetails() {
  const [userData, setUserData] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [api, setApi] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const token = window.localStorage.getItem("token");
    if (token) {
      // User is logged in, fetch user data
      fetch("http://localhost:8000/userData", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          token: token,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "ok") {
            // User data fetched successfully
            setUserData(data.data);
            setIsLoggedIn(true);
          } else {
            // Token expired or invalid, clear localStorage and redirect to login
            window.localStorage.clear();
            window.location.href = "./sign-in";
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      // User is not logged in, redirect to login
      window.location.href = "./login";
    }
  }, []);

  if (!isLoggedIn) {
    // Render a loading state or redirect to login
    return <div>Loading...</div>;
  }

  const handleContinue = () => {
    setShowForm(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    // You can access the form field values using the respective state variables
    console.log("Username:", userData.Username);
    console.log("Password:", password);
    console.log("TOTP:", totp);
    console.log("API:", api);
    console.log("API Key:", apiKey);
    console.log("Secret Key:", secretKey);
  };

  const handleLogout = () => {
    // Clear token from local storage
    window.localStorage.removeItem("token");
    // Redirect to login page
    window.location.href = "./login";
  };

  return (
    <div>
      <h2>{userData.email}</h2>
      <h2>{userData.FullName}</h2>
      <h2>{userData.Username}</h2>
      <h2>{userData.password}</h2>
      <div>
        <label htmlFor="dropdown">Select an option:</label>
        <select id="dropdown" value={selectedOption} onChange={handleOptionChange}>
          <option value="">-- Select --</option>
          <option value="Zerodha">Zerodha</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>
      <p>Selected option: {selectedOption}</p>
      <button onClick={handleContinue}>Continue</button>

      <button onClick={handleLogout}>Logout</button>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <h2>Additional Form</h2>
         

          <div>
            <label htmlFor="username">UserName:</label>
            <input type="text" id="username" value={userData.Username} contentEditable={false} />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div>
            <label htmlFor="totp">TOTP:</label>
            <input type="text" id="totp" value={totp} onChange={(e) => setTotp(e.target.value)} />
          </div>

          <div>
            <label htmlFor="api">API:</label>
            <input type="text" id="api" value={api} onChange={(e) => setApi(e.target.value)} />
          </div>

          <div>
            <label htmlFor="apiKey">API Key:</label>
            <input type="text" id="apiKey" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
          </div>

          <div>
            <label htmlFor="secretKey">Secret Key:</label>
            <input type="text" id="secretKey" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} />
          </div>

          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}
