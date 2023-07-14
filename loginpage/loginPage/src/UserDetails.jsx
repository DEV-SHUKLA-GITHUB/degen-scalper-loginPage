import React, { useEffect, useState } from "react";
import DropdownButton from "./basic components/userDetailsDropDown";
import Typewriter from "typewriter-effect";

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

 const data = JSON.parse(window.localStorage.getItem("userdata")).BrokerList
 console.log(data)
  let value;
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setShowForm(true);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const token = window.localStorage.getItem("token");
    const email = window.localStorage.getItem("email");
    const username = window.localStorage.getItem("username");
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
          email: email,
          username: username,
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
  console.log(userData)


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
  function handleButtonClick(){
    fetch("http://localhost:8000/generateToken", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.status==true){
          console.log("congrats yoda")
        }
        else{
          console.log("failed")
        }
      })
    
  }

  const handleShowData = () => {
    // console.log(formData.data)
    // Iterate over the form data array and display each element
    const formDisplayData = [];
    formData.forEach((data, index) => {
      console.log(`Data ${index + 1}:`, data);
      setShow(true);
      show && <div>{data}</div>;
      // You can modify the code here to display the data on the page
    });

    // Update the showValue state with the display array
    // setShowValue(formDisplayData);
  };

  return (
    <div className="h-screen w-full bg-opacity-70 text-white m-0 ok">
      <div className="w-full border-b-2 border-cyan-800  p-3 flex justify-between">
        <h1 className="text-2xl text-cyan-300"> Degen Money</h1>
        <button className="text-2xl text-cyan-300  p-2 " onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className=" flex w-full h-4/6">
        <div   className="border-r-2 font-thin  border-cyan-800 w-1/4 flex items-center justify-center text-4xl text-cyan-300 capitalize">
          <Typewriter
            onInit={(typewriter) => {
              typewriter
            
                .typeString( ` Welcome ${userData.FullName}`)
                .callFunction(() => {
                  console.log("String typed out!");
                }) 
                
                
                
                .start();
                
            }}
           />
        </div>

        <div className="m-3 w-3/4 flex flex-col items-center justify-center ">
          <select
            id="dropdown"
            value={selectedOption}
            onChange={handleOptionChange}
            disabled={showForm ? true : false}
            className="text-white p-3 mb-8 bg-black border h-16 w-48 relative rounded-lg appearance-none focus:outline-none focus:border-cyan-300 transition-opacity duration-300"
          >
            <option value="">Select Broker</option>
            <option value="Zerodha" className="">
              Zerodha
            </option>
            <option value="fyers" className="">
              fyers
            </option>
            <option value="upstox" className="">
              upstox
            </option>
            <option value="angel one" className="">
              Angel One
            </option>
            <option value="Anand Money" className="">
              Anand Money
            </option>
          </select>

          {/* <DropdownButton /> */}
          {showForm && (
            <form
              className="border-2 border-cyan-300  flex flex-col p-5 w-5/12  "
              onSubmit={handleSubmit}
            >
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="floating_email"
                  id="floating_email"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-cyan-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
                <label
                  for="floating_email"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-cyan-300 peer-focus:dark:text-cyan-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  User Id
                </label>
              </div>

              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="password"
                  name="floating_password"
                  id="floating_password"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-cyan-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label
                  for="floating_password"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-cyan-300 peer-focus:dark:text-cyan-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Password
                </label>
              </div>

              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  id="apiKey"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-cyan-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <label
                  for="apiKey"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-cyan-300 peer-focus:dark:text-cyan-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  API Key :
                </label>
              </div>

              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  id="secretKey"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-cyan-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                />
                <label
                  for="apiKey"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-cyan-300 peer-focus:dark:text-cyan-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Secret Key :
                </label>
              </div>
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  id="totp"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-cyan-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  value={totp}
                  onChange={(e) => setTotp(e.target.value)}
                />
                <label
                  for="totp"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-cyan-300 peer-focus:dark:text-cyan-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  totp :
                </label>
              </div>

              <button
                type="submit"
                onClick={handleShowData}
                className="   text-black bg-cyan-300 hover:bg-cyan-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-cyan-300 dark:hover:bg-cyan-700 dark:focus:ring-cyan-600"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="h-content w-full h-">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-auto x">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 h-60">
            <thead className="border-t border-cyan-800 bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Broker name
                </th>
                <th scope="col" className="px-6 py-3">
                  Date and Time
                </th>
                <th scope="col" className="px-6 py-3">
                  Secret key
                </th>
                <th scope="col" className="px-6 py-3">
                  totp
                </th>
                <th scope="col" className="px-6 py-3">
                  <span class="sr-only"></span>
                </th>
              </tr>
            </thead>
            <tbody>
{
  data && data.map((item)=>(
    <tr class="">
    <th
      scope="row"
      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      Zerodha
    </th>
    <td class="px-6 py-4">{item.totp}</td>
    <td class="px-6 py-4">{item.secretKey}</td>
    <td class="px-6 py-4 text-right">
      <button className="text-red-600" onClick={handleButtonClick}>
        Generate Token
      </button>
    </td>
  </tr>
  ))
}
              {/* <tr class="">
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Zerodha
                </th>
                <td class="px-6 py-4">22-07-23 18:23 IST</td>
                <td class="px-6 py-4">23456788***</td>
                <td class="px-6 py-4">2345</td>
                <td class="px-6 py-4 text-right">
                  <a href="#" class="text-red-600">
                    Delete
                  </a>
                </td>
              </tr>
              <tr class=" hover:bg-gray-700">
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Fyres
                </th>
                <td class="px-6 py-4">22-07-23 18:23 IST</td>
                <td class="px-6 py-4">23456788***</td>
                <td class="px-6 py-4">3456</td>
                <td class="px-6 py-4 text-right">
                  <a href="#" class="font-medium text-red-600">
                    Delete
                  </a>
                </td>
              </tr>
              <tr className="">
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Upstox
                </th>
                <td class="px-6 py-4">22-07-23 18:23 IST</td>
                <td class="px-6 py-4">32323233***</td>
                <td class="px-6 py-4">2345</td>
                <td class="px-6 py-4 text-right">
                  <a href="#" class="font-medium text-red-600">
                    Delete
                  </a>
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}