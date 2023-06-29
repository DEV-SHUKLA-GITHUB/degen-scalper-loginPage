import React, { useEffect, useState } from "react";

export default function UserDetails() {
  const [userData, setUserData] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };
  useEffect(() => {
    // Fetch user data from the server
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    const token = window.localStorage.getItem("token");

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
          setUserData(data.data);
        } else {
          // Handle error response
        }
      })
      .catch((error) => {
        // Handle fetch error
      });
  };
  const handleContinue = () => {
    setShowForm(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    // You can access the username using selectedOption state
    console.log("Username:", selectedOption);
  };

  const handleLogout = () => {
    // Clear token from local storage
    window.localStorage.removeItem("token");
    // Redirect to login page
    window.location.href = "./login";
  };

  return (
    <div>
      <h1>{userData.email}</h1>
      <h1>{userData.FullName}</h1>
      <h1>{userData.Username}</h1>
      <h1>{userData.password}</h1>
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
          <p>Username: {userData.Username}</p>
          {/* Add additional form fields and logic here */}
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}
