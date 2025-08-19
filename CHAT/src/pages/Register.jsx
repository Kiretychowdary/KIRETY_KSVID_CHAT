import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

//RADHAKRISHNALOVEPERMANLTUUUUUU
//RADHAKRISHNALOVEUUUMAPERMNANLTUUUUU
//RADHAKRISHNALOVEUUUMAPERMANTLUUUUUU
//LOVESHIVAPARVATHIMALOVEUUUUMAPERMALTUUU
//VINYAKALAKSHMILOVEUUUMAPERMANENLTUUUUU
//JAISITARAMA
//RADHAKRISHNALOVEPERMANTLUUUUU

import { registerRoute } from "../utils/APIRoutes";
import Logo from "../assets/react.svg";

// ---- Professional Color Scheme ----
const primaryColor = "#2563eb"; // Professional blue
const secondaryColor = "#1e40af"; // Darker blue
const accentColor = "#3b82f6"; // Light blue accent
const textColor = "#1f2937"; // Dark gray
const lightGray = "#f8fafc"; // Very light gray
const mediumGray = "#e2e8f0"; // Medium gray
const backgroundGradient = "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)"; // Subtle gray gradient
// ----------------------------------------

function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "", email: "", password: "", confirmPassword: ""
  });

  async function handleSubmit(event) {
    event.preventDefault();
    if (handleValidation()) {
      try {
        const { username, email, password } = values;
        const user = { username, email, password }
        const { data } = await axios.post(registerRoute, user)
        console.log(data);
        if (data) {
          // console.log("RADHAKRISHNALOVEPERMANLTUUUUUU");
          localStorage.setItem('chat-app-user', JSON.stringify(data.user_saved))
          navigate('/');
        }
        else {
          toast.error(data.message);
          console.log("Registration failed");
        }
      }
      catch (error) {
        toast.error(error.message,"HII");
      }
    }
    console.log("Form submitted successfully");
  }


  function handleChange(event) {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  }


  function handleValidation() {
    if (values.username.length < 3) {
      toast.error("Name must be at least 3 characters long");
      return false;
    }
    if (!values.email.includes("@")) {
      toast.error("Invalid email address");
      return false;
    }
    if (values.password.length < 7) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  }


  return (
    <>
      <StyledBG>
        <GlassCard>
          <AnimatedLogo>
            <img src={Logo} alt="Logo" />
          </AnimatedLogo>
          <h1 className="heading">KSVID_CHAT_APPLICATION</h1>
          <form className="form" onSubmit={handleSubmit}>
            <span className="input-span">
              <label htmlFor="username" className="label">
                Username
              </label>
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={values.username}
                onChange={handleChange}
                className="input-field"
                autoComplete="username"
              />
            </span>
            <span className="input-span">
              <label htmlFor="email" className="label">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                className="input-field"
                autoComplete="email"
              />
            </span>
            <span className="input-span">
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={values.password}
                onChange={handleChange}
                className="input-field"
                autoComplete="new-password"
              />
            </span>
            <span className="input-span">
              <label htmlFor="confirmPassword" className="label">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                className="input-field"
                autoComplete="new-password"
              />
            </span>
            <button className="submit" type="submit">
              <span>Create Account</span>
              <span className="glow"></span>
            </button>
            <span className="span">
              Already Have an Account? <Link to="/">Login</Link>
            </span>
          </form>
        </GlassCard>
      </StyledBG>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

// --- Styled Components and Animations ---
const subtleFloat = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
`;

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(20px);}
  100% { opacity: 1; transform: translateY(0);}
`;

const StyledBG = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: ${backgroundGradient};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

const GlassCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid ${mediumGray};
  padding: 3rem 2.5rem 2.5rem 2.5rem;
  min-width: 400px;
  max-width: 450px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeInUp} 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, ${primaryColor}, ${accentColor});
    border-radius: 0 0 4px 4px;
  }

  .heading {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${textColor};
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    margin-bottom: 2rem;
    margin-top: 1rem;
    text-align: center;
    font-family: 'Inter', sans-serif;
    line-height: 1.2;
  }

  .form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    align-items: center;
  }

  .input-span {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .label {
    color: ${textColor};
    font-weight: 600;
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
    margin-left: 0.125rem;
    letter-spacing: 0.025em;
  }

  .input-field {
    border-radius: 8px;
    padding: 0.875rem 1rem;
    width: 100%;
    border: 2px solid ${mediumGray};
    background: ${lightGray};
    color: ${textColor};
    font-size: 1rem;
    outline: none;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: inherit;
    box-sizing: border-box;

    &::placeholder {
      color: #9ca3af;
    }

    &:focus {
      border-color: ${primaryColor};
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    &:hover:not(:focus) {
      border-color: #cbd5e1;
    }
  }

  .submit {
    margin-top: 1rem;
    padding: 0.875rem 2rem;
    width: 100%;
    border-radius: 8px;
    border: none;
    background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%);
    color: #ffffff;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.025em;
    position: relative;
    overflow: hidden;

    &:hover {
      background: linear-gradient(135deg, ${secondaryColor} 0%, ${primaryColor} 100%);
      transform: translateY(-1px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
    }
  }

  .submit .glow {
    display: none;
  }

  .span {
    width: 100%;
    text-align: center;
    color: #6b7280;
    font-size: 0.95rem;
    margin-top: 1.5rem;
    line-height: 1.5;
  }

  .span a {
    color: ${primaryColor};
    text-decoration: none;
    font-weight: 600;
    margin-left: 0.25rem;
    transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      color: ${secondaryColor};
      text-decoration: underline;
    }

    &:focus {
      outline: 2px solid ${primaryColor};
      outline-offset: 2px;
      border-radius: 2px;
    }
  }

  @media (max-width: 500px) {
    min-width: 0;
    width: 100%;
    max-width: 380px;
    padding: 2rem 1.5rem;
    border-radius: 12px;
    
    .heading { 
      font-size: 1.5rem; 
      margin-bottom: 1.5rem;
    }
    
    .input-field {
      padding: 0.75rem 0.875rem;
    }
    
    .submit {
      padding: 0.75rem 1.5rem;
    }
    
    .form {
      gap: 1rem;
    }
  }
`;

const AnimatedLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  
  img {
    width: 48px;
    height: 48px;
    filter: drop-shadow(0 4px 6px rgba(37, 99, 235, 0.2));
    animation: ${subtleFloat} 4s ease-in-out infinite;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      transform: scale(1.05);
    }
  }
`;

export default Register;
