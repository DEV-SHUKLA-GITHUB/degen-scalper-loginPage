import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bg from "./assets/mainBg.mp4";

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
  const [welcomeText, setWelcomeText] = useState("");

  useEffect(() => {
    const text = "Weelcome to Degen Money";
    let index = 0;
    let timer;

    const animateText = () => {
      if (index < text.length-1) {
        setWelcomeText((prevText) => prevText + text[index]);
        index++;
      } else {
        clearInterval(timer);
      }
    };

    timer = setInterval(animateText, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

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
              setTimeout(() => setIsEmailExists(false), 2000); // Clear email error after 2 seconds
            } else if (res.usernameExists) {
              setIsUsernameExists(true);
              setTimeout(() => setIsUsernameExists(false), 2000); // Clear username error after 2 seconds
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
    <div className="relative h-screen">
      <video
        className="absolute top-0 left-0 w-full h-100% object-cover z-0"
        src={bg}
        autoPlay
        loop
        muted
      />

      <div className="flex items-center justify-center h-screen">
        <div className="w-1/4 bg-transparent text-white p-8 z-10">
          {isRegistrationSuccessful ? (
            <div className="bg-green-500 text-white p-4 mb-4">
              Registration Successful!
            </div>
          ) : (
            <div className="mb-6">
              <h2
                className="text-4xl font-bold mb-4"
                style={{
                  textShadow: "0px 3px 4px rgba(36, 219, 16, 1)",
                  color: "white",
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: "lighter",
                  width: "100%",
                  fontSize: "18px"
                }}
              >
                {welcomeText}
              </h2>
              {fields.map((field, index) => {
                if (index <= currentStep) {
                  return (
                    <div className="mb-6" key={index}>
                      <label className="block mb-2">{field.label}:</label>
                      <input
                        type={field.label === "email" ? "email" : "text"}
                        value={field.value}
                        onChange={(e) => handleInputChange(e, index)}
                        className={`w-full h-8 p-2 bg-transparent border rounded-md text-white ${
                          field.error ? "border-red-500 rounded" : "border-gray-400 rounded"
                        }`}
                      />
                      {field.error && (
                        <div className="bg-red-500 rounded text-white p-2 mt-2">
                          {field.error}
                        </div>
                      )}
                      {currentStep === index && (
                        <button
                          onClick={handleContinue}
                          className="bg-transparent border text-white px-4 py-2 mt-4 rounded"
                        >
                          {currentStep === fields.length - 1 ? "Submit" : "Continue"}
                        </button>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
          {isEmailExists && (
            <div className="bg-red-500 text-white p-2 mb-4">
              Email already exists. Please choose a different email.
            </div>
          )}
          {isUsernameExists && (
            <div className="bg-red-500 text-white p-2 mb-4">
              Username already exists. Please choose a different username.
            </div>
          )}
          <div className="text-center">
            Already registered?
            <div className="text-center">
              <Link
                to="/login"
                className="inline-block bg-transparent border text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
