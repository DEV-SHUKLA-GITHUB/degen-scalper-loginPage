import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const RegistrationForm = () => {
  const [fields, setFields] = useState([
    { label: "FullName", value: "", error: "" },
    { label: "email", value: "", error: "" },
    { label: "password", value: "", error: "" },
    { label: "Username", value: "", error: "" },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRegistrationSuccessful, setIsRegistrationSuccessful] = useState(false);
  const [isEmailExists, setIsEmailExists] = useState(false);
  const [isUsernameExists, setIsUsernameExists] = useState(false);

  useEffect(() => {
    let timer;

    if (isEmailExists || isUsernameExists) {
      timer = setTimeout(() => {
        setIsEmailExists(false);
        setIsUsernameExists(false);
      }, 2000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isEmailExists, isUsernameExists]);

  const handleInputChange = (e, index) => {
    const updatedFields = [...fields];
    updatedFields[index].value = e.target.value;
    setFields(updatedFields);
  };

  const validateForm = () => {
    let isValid = true;
    const updatedFields = [...fields];

    if (updatedFields[currentStep].value.trim() === "") {
      updatedFields[currentStep].error = "Please enter a value.";
      isValid = false;
    } else {
      updatedFields[currentStep].error = "";
    }

    if (currentStep === 1 && !isValidEmail(updatedFields[currentStep].value)) {
      updatedFields[currentStep].error = "Please enter a valid email address.";
      isValid = false;
    }

    setFields(updatedFields);
    return isValid;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (currentStep === fields.length - 1) {
        const { FullName, email, password, Username } = fields.reduce(
          (values, field) => {
            values[field.label] = field.value;
            return values;
          },
          {}
        );

        // Check email and username existence before submitting
        fetch("http://localhost:8000/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, Username }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.emailExists) {
              setIsEmailExists(true);
            } else if (res.usernameExists) {
              setIsUsernameExists(true);
            } else {
              fetch("http://localhost:8000/register", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ FullName, email, password, Username }),
              })
                .then((res) => res.json())
                .then((res) => {
                  console.log(res, "userRegister");
                  setIsRegistrationSuccessful(true);
                })
                .catch((error) => {
                  console.error("Registration failed:", error);
                  setIsRegistrationSuccessful(false);
                });
            }
          })
          .catch((error) => {
            console.error("Error checking email and username:", error);
          });
      } else {
        setCurrentStep((prevStep) => prevStep + 1);
      }
    }
  };

  return (
    <div className="registration-form">
      {isRegistrationSuccessful ? (
        <div className="success-message">Registration Successful!</div>
      ) : (
        fields.map((field, index) => {
          if (index <= currentStep) {
            return (
              <div className="form-group" key={index}>
                <label>{field.label}:</label>
                <input
                  type={field.label === "email" ? "email" : "text"}
                  value={field.value}
                  onChange={(e) => handleInputChange(e, index)}
                  className={field.error ? "input-error" : ""}
                />
                {field.error && <span className="error">{field.error}</span>}
                {currentStep === index && (
                  <button onClick={handleContinue}>
                    {currentStep === fields.length - 1 ? "Submit" : "Continue"}
                  </button>
                )}
              </div>
            );
          }
          return null;
        })
      )}
      {isEmailExists && (
        <div className="error-message">Email already exists. Please choose a different email.</div>
      )}
      {isUsernameExists && (
        <div className="error-message">Username already exists. Please choose a different username.</div>
      )}
      <div className="login-link">
        Already registered? Please <Link to="/login">sign in</Link>.
      </div>
    </div>
  );
};

export default RegistrationForm;
