import React, { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

//   const [fields, setFields] = useState([
//     { label: "email", value: "", error: "" },
//     { label: "password", value: "", error: "" },
//   ]);

  const handleEmailChange = (e) => {
    e.preventDefault();
setEmail(e.target.value)
  };
  const handlePasswordChange = (e) => {
    e.preventDefault();
setPassword(e.target.value)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // const{email,password} ]
    // const { email, password } = fields.reduce(
    //     (values, field) => {
    //       values[field.label] = field.value;
    //       return values;
    //     },
    //     {} 
    //   );

    console.log(email,password);
    fetch("http://localhost:8000/login-user",{
        method:"POST",
        crossDomain:true,
                headers:{
                    "Content-Type":"application/json",
                    Accept:"application/json",
                    "Access-Control-Allow-Origin":"*",
                },
                body:JSON.stringify({
                    email:email,
                    password:password
                })
    })
    // console.log("Login form submitted");
    .then((res)=>res.json())
    .then((data)=>{
        console.log(data,"userRegister");
        if(data.status === "ok"){
            alert("login successful");
            window.localStorage.setItem("token",data.data);
            window.location.href = "./userDetails";
        }
    })
  };

  return (
    <div className="login-form">
      <h2>Login Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={handleEmailChange} />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={handlePasswordChange} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;