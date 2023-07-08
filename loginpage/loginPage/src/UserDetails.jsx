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
    setShowForm(false);
    setShow(true);
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
      setShow(true);
      show && <div>{data}</div>;
      // You can modify the code here to display the data on the page
    });
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gray-100 flex items-center justify-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Hello {userData.Username}</h2>
          <div>
            <label htmlFor="dropdown" className="mr-2">
              Select a broker:
            </label>
            <select
              id="dropdown"
              value={selectedOption}
              onChange={handleOptionChange}
              className="border border-gray-300 rounded p-2"
            >
              <option value="">-- Select --</option>
              <option value="Zerodha">Zerodha</option>
              <option value="fyers">fyers</option>
              <option value="upstox">upstox</option>
              <option value="angel one">Angel One</option>
              <option value="Anand Money">Anand Money</option>
            </select>
          </div>
          <p className="mt-2">Selected Broker: {selectedOption}</p>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="w-1/2 bg-white flex items-center justify-center">
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="max-w-sm px-6 py-4 bg-gray-100 rounded"
          >
            <h2 className="text-2xl font-bold mb-4">Additional Form</h2>
            <div className="mb-4">
              <label htmlFor="userId" className="block">
                User Id:
              </label>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block">
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="totp" className="block">
                TOTP:
              </label>
              <input
                type="text"
                id="totp"
                value={totp}
                onChange={(e) => setTotp(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="apiKey" className="block">
                API Key:
              </label>
              <input
                type="text"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="secretKey" className="block">
                Secret Key:
              </label>
              <input
                type="text"
                id="secretKey"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Submit
            </button>
          </form>
        )}
        <button
          onClick={handleShowData}
          className="ml-4 bg-green-500 text-white py-2 px-4 rounded"
        >
          Show
        </button>
        {show && <div>{value}</div>}
      </div>
    </div>
  );
}
