import React, { useEffect, useState } from "react";
// import AdminHome from "./adminHome";
// import UserHome from "./userHome";

export default function UserDetails() {
  const [userData, setUserData] = useState("");
//   const [admin, setAdmin] = useState(false);

  useEffect(() => {
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
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("success");
        // if (data.data.userType === "Admin") {
        //   setAdmin(true);
        // }
        setUserData(data.data);
        console.log(userData)
        // console.log(userData)
        

        if (data.data === "token expired") {
          alert("Token expired. Please login again.");
          window.localStorage.clear();
          window.location.href = "./sign-in";
        }
      });
  }, []);

  // return admin ? <AdminHome /> : <UserHome userData={userData} />;
return(
  <div>
    <h1>{userData.email}</h1>
    <h1>{userData.FullName}</h1>
    <h1>{userData.Username}</h1>
    <h1>{userData.password}</h1>
  </div>
)
}