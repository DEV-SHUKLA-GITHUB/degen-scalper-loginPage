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
  const [selectedOptions, setSelectedOptions] = useState([]);

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

    // Create a new array with the existing selected options and the new selected option
    const updatedSelectedOptions = [...selectedOptions, selectedOption];

    // Update the state with the updated form data and selected options
    setFormData(updatedFormData);
    setSelectedOptions(updatedSelectedOptions);

    // Reset the form fields
    setSelectedOption("");
    setPassword("");
    setTotp("");
    setUserId("");
    setApiKey("");
    setSecretKey("");

    // Clear the show form flag
    setShowForm(false);
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
    <div className="flex flex-col h-screen bg-black">
      <div className="bg-black text-white py-4 px-6">
        <h2 className="text-5xl">Hello, {userData.Username}</h2>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <div className="mb-4">
            <label
              htmlFor="dropdown"
              className="block mb-2 font-bold text-gray-400"
            >
              Select a broker:
            </label>
            <select
              id="dropdown"
              value={selectedOption}
              onChange={handleOptionChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select --</option>
              <option value="Zerodha">Zerodha</option>
              <option value="fyers">fyers</option>
              <option value="upstox">upstox</option>
              <option value="angel one">Angel One</option>
              <option value="Anand Money">Anand Money</option>
            </select>
          </div>
          <p>Selected Broker: {selectedOption}</p>

          <div className="mt-8">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 absolute top-0 right-0 mt-4 mr-4"
            >
              Logout
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="mt-8">
              <h2 className="mb-4 text-lg font-bold">Additional Form</h2>

              {/* Existing fields */}

              <div className="mb-4">
                <label
                  htmlFor="userId"
                  className="block mb-2 font-bold text-gray-400"
                >
                  User Id:
                </label>
                <input
                  type="text"
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block mb-2 font-bold text-gray-400"
                >
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="totp"
                  className="block mb-2 font-bold text-gray-400"
                >
                  TOTP:
                </label>
                <input
                  type="text"
                  id="totp"
                  value={totp}
                  onChange={(e) => setTotp(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="apiKey"
                  className="```jsx
                block mb-2 font-bold text-gray-400"
                >
                  API Key:
                </label>
                <input
                  type="text"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="secretKey"
                  className="block mb-2 font-bold text-gray-400"
                >
                  Secret Key:
                </label>
                <input
                  type="text"
                  id="secretKey"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="bg-black text-white py-2 px-4 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </form>
          )}
          {/* <button
            onClick={handleShowData}
            className="mt-8 bg-black text-white py-2 px-4 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Show
          </button> */}
        </div>
        {show && (
          <div className="mt-8">
            {/* Display the form data here */}
            {formData.map((data, index) => (
              <div key={index} className="mb-4 t">
                <h2>Data {index + 1}:</h2>
                <p>Username: {data.username}</p>
                <p>Password: {data.password}</p>
                <p>TOTP: {data.totp}</p>
                <p>User Id: {data.userId}</p>
                <p>API Key: {data.apiKey}</p>
                <p>Secret Key: {data.secretKey}</p>
                <p>Broker: {data.broker}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
