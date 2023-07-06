import React, { useEffect, useState } from "react";

export default function UserDetails() {
  const [userData, setUserData] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [userId, setUserId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [formData, setFormData] = useState([]);
let value;
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setShowForm(true);
  };
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const token = window.localStorage.getItem("token");
    if (token) {
      // User is logged in, fetch user data
      fetch("http://localhost:8000/checkAuth", {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  
    // Construct the form data object
    const formDataObj = {
      username: userData.Username,
      password,
      totp,
      userId,
      apiKey,
      secretKey,
      broker: selectedOption, // Add the selected dropdown value
    };
  
    // Create a new array with the existing form data and the new form data object
    const updatedFormData = [...formData, formDataObj];
  
    // Serialize the form data array as a string
    const formDataString = JSON.stringify(updatedFormData, null, 2);
  
    // Send the updated form data string to the backend
    fetch("http://localhost:8000/userData", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
        BrokerList: formDataObj, // Send the form data string
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          console.log("Form data updated successfully");
          setFormData(updatedFormData); // Update the local state with the updated form data
        } else {
          console.error("Error updating form data:", data.data);
        }
      })
      .catch((error) => {
        console.error("Error updating form data:", error);
      });
      setShowForm(false)
      setShow(true)
  };
  
  
  
  
  const handleLogout = () => {
    // Clear token from local storage
    window.localStorage.removeItem("token");
    // Redirect to login page
    window.location.href = "./login";
  };
  const handleShowData = () => {
    // Iterate over the form data array and display each element
    formData.forEach((data, index) => {
      
      console.log(`Data ${index + 1}:`, data);
      setShow(true)
      show && (
        <div>
          {data}
        </div>
      )
      // You can modify the code here to display the data on the page
    });
  };

  return (
    <div>
      {/* <h2>{userData.email}</h2>
      <h2>{userData.FullName}</h2>
      <h2>{userData.Username}</h2>
      <h2>{userData.password}</h2> */}
      <div>
        <label htmlFor="dropdown">Select a broker:</label>
        <select id="dropdown" value={selectedOption} onChange={handleOptionChange}>
          <option value="">-- Select --</option>
          <option value="Zerodha">Zerodha</option>
          <option value="fyers">fyers</option>
          <option value="upstox">upstox</option>
          <option value="angel one">Angel One</option>
          <option value="Anand Money">Anand Money</option>
        </select>
      </div>
      <p>Selected Broker: {selectedOption}</p>
      <br />
      <br />

      <button onClick={handleLogout}>Logout</button>
      <br /><br />
      {showForm && (
      <form onSubmit={handleSubmit}>
        <h2>Additional Form</h2>

        {/* Existing fields */}

        <div>
          <label htmlFor="user Id">User Id:</label>
          <input type="text" id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} />
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
        <button onClick={handleShowData}>Show</button>
            {show && 
          (
            <div>{value}</div>
          )
        }
    </div>
  );
}