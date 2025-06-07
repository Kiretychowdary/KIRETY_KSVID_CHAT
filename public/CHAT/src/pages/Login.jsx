import React, { useState } from "react"; import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
//RADHAKRISHNALOVEPERMANLTUUUUUUU
//RADHAKRISHNALOVEUUUMAPERMNANLTUUUUU
//RADHAKRISHNALOVEUUUMAPERMANTLUUUUUU
//LOVESHIVAPARVATHIMALOVEUUUUMAPERMALTUUU
//VINYAKALAKSHMILOVEUUUMAPERMANENLTUUUUU
//JAISITARAMA
//RADHAKRISHNALOVEPERMANTLUUUUU

import { loginRoute } from "../utils/APIRoutes";
import Logo from "../assets/react.svg";

// function Register() {
//     const navigate = useNavigate();
//     const [values, setValues] = useState({
//         username: "", email: "", password: "", confirmPassword: ""
//     });

//     async function handleSubmit(event) {
//         event.preventDefault();
//         // console.log("RADHAKRISHNALOVEPERMANENETLUUUUUU")
//         if (handleValidation()) {
//             const { username, email, password } = values;
//             const user = { username, email, password }
//             // console.log("RADHAKRISHNALOVEPERMANENETLUUUUUU")
//             try {
//                 console.log("RADHAKRISHNALOVEPERMANENETLUUUUUU")

//                 const { data } = await axios.post(loginRoute, user);
//                 if (data) {
//                     localStorage.setItem('chat-app-user', JSON.stringify(data.user_data))
//                 }
//                 // console.log("RADHAKRISHNALOVEPERMANENETLUUUUUU")
//                 console.log("Login Response:", data); // 🔍 Check this
//                 navigate("/avatar");
//                 toast.success("User logged in successfully!");
//                 // console.log("RADHAKRISHNALOVEPERMANENETLUUUUUU")

//             } catch (error) {
//                 console.error("Login error:", error);
//                 toast.error("Check the credentials");
//             }


//         }
//     }


//     function handleChange(event) {
//         const { name, value } = event.target;
//         setValues({
//             ...values,
//             [name]: value,
//         });
//     }


//     function handleValidation() {
//         if (values.username.length == "") {
//             toast.error("Enter The Username");
//             return false;
//         }
//         if (!values.email.includes("@")) {
//             toast.error("Invalid email address");
//             return false;
//         }
//         if (values.password.length < 6) {
//             toast.error("Password must be at least 6 characters long");
//             return false;
//         }
//         return true;
//     }

//     return (
//         <>
//             <FormContainer>
//                 {/* <form onSubmit={handleSubmit}>
//                     <div className="brand">
//                         <img src={Logo} alt="Logo" />
//                         <h1>KSVID_CHAT_APP</h1>
//                     </div>
//                     <input
//                         type="text"
//                         placeholder="Username"
//                         name="username"
//                         value={values.username}
//                         onChange={handleChange}
//                     />
//                     <input
//                         type="email"
//                         placeholder="Email"
//                         name="email"
//                         value={values.email}
//                         onChange={handleChange}
//                     />
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         name="password"
//                         value={values.password}
//                         onChange={handleChange}
//                     />

//                     <button type="submit">Submit</button>
//                     <span>
//                         Already Have an Account? <Link to="/Register">Register</Link>
//                     </span>
//                 </form> */}
//                 <form onSubmit={handleSubmit}>
//                     <h1>KSVID_CHAT_APP</h1>
//                     <p id="heading">Login</p>
//                     <div class="field">
//                         <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
//                             <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
//                         </svg>
//                         <input
//                             type="text"
//                             placeholder="Username"
//                             name="username"
//                             value={values.username}
//                             onChange={handleChange}
//                         />
//                     </div>
//                     <div class="field">
//                         <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
//                             <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
//                         </svg>
//                         <input
//                             type="password"
//                             placeholder="Password"
//                             name="password"
//                             value={values.password}
//                             onChange={handleChange}
//                         />
//                     </div>
//                     <div class="btn">
//                         <button class="button1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Login&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
//                         <button class="button2">Sign Up</button>
//                     </div>
//                 </form>
//             </FormContainer>
//             <ToastContainer position="top-right" autoClose={3000} />
//         </>
//     );
// }

// const FormContainer = styled.div`
// .form {
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
//   padding-left: 2em;
//   padding-right: 2em;
//   padding-bottom: 0.4em;
//   background-color: #171717;
//   border-radius: 25px;
//   transition: .4s ease-in-out;
// }

// .form:hover {
//   transform: scale(1.05);
//   border: 1px solid black;
// }

// #heading {
//   text-align: center;
//   margin: 2em;
//   color: rgb(255, 255, 255);
//   font-size: 1.2em;
// }

// .field {
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 0.5em;
//   border-radius: 25px;
//   padding: 0.6em;
//   border: none;
//   outline: none;
//   color: white;
//   background-color: #171717;
//   box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
// }

// .input-icon {
//   height: 1.3em;
//   width: 1.3em;
//   fill: white;
// }

// .input-field {
//   background: none;
//   border: none;
//   outline: none;
//   width: 100%;
//   color: #d3d3d3;
// }

// .form .btn {
//   display: flex;
//   justify-content: center;
//   flex-direction: row;
//   margin-top: 2.5em;
// }

// .button1 {
//   padding: 0.5em;
//   padding-left: 1.1em;
//   padding-right: 1.1em;
//   border-radius: 5px;
//   margin-right: 0.5em;
//   border: none;
//   outline: none;
//   transition: .4s ease-in-out;
//   background-color: #252525;
//   color: white;
// }

// .button1:hover {
//   background-color: black;
//   color: white;
// }

// .button2 {
//   padding: 0.5em;
//   padding-left: 2.3em;
//   padding-right: 2.3em;
//   border-radius: 5px;
//   border: none;
//   outline: none;
//   transition: .4s ease-in-out;
//   background-color: #252525;
//   color: white;
// }

// .button2:hover {
//   background-color: black;
//   color: white;
// }

// .button3 {
//   margin-bottom: 3em;
//   padding: 0.5em;
//   border-radius: 5px;
//   border: none;
//   outline: none;
//   transition: .4s ease-in-out;
//   background-color: #252525;
//   color: white;
// }

// .button3:hover {
//   background-color: red;
//   color: white;
// }
//   height: 500px;
//   width: 500px;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   background-color: white;
//   border-radius: 10px;
//   .brand {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     gap: 10px;
//     height: 200px;
//     justify-content: center;
//   }
//   form {
//     display: flex;
//     flex-direction: column;
//     gap: 10px;
//     align-items: center;
//   }
//   input {
//     padding: 10px;
//     border: 1px solid #ccc;
//     border-radius: 5px;
//     width: 80%;
//     color: black;
//     font-size: 16px;
//     &:focus {
//       outline: none;
//       border-color: #4caf50;
//       background:white;
//     }

//   }
//   button {
//     padding: 10px;
//     border: 1px solid #ccc;
//     border-radius: 5px;
//     background-color: #4caf50;
//     color: white;
//     width: 80%;
//     font-size: 16px;
//     cursor: pointer;
//     &:hover {
//       background-color: #45a049;
//     }
//   }
//   span {
//     font-size: 14px;
//   }
// `;
// function Register() {
//   const navigate = useNavigate();
//   const [values, setValues] = useState({
//     username: "", email: "", password: "", confirmPassword: ""
//   });

//   async function handleSubmit(event) {
//     event.preventDefault();
//     if (handleValidation()) {
//       const { username, email, password } = values;
//       const user = { username, email, password };
//       try {
//         const { data } = await axios.post(loginRoute, user);
//         if (data) {
//           localStorage.setItem('chat-app-user', JSON.stringify(data.user_data));
//           console.log(data.user_data.isAvatarImageSet)
//           if (data.user_data.isAvatarImageSet == true) {
//             navigate("/chat");
//           }
//           else {
//             navigate("/avatar");
//           }
//           toast.success("User logged in successfully!");
//         }
//       } catch (error) {
//         console.error("Login error:", error);
//         toast.error("Check the credentials");
//       }
//     }
//   }

//   function handleChange(event) {
//     const { name, value } = event.target;
//     setValues({ ...values, [name]: value });
//   }

//   function handleValidation() {
//     if (values.username.trim() === "") {
//       toast.error("Enter The Username");
//       return false;
//     }
//     if (!values.email.includes("@")) {
//       toast.error("Invalid email address");
//       return false;
//     }
//     if (values.password.length < 6) {
//       toast.error("Password must be at least 6 characters long");
//       return false;
//     }
//     return true;
//   }

//   return (
//     <>
//       <FormContainer>
//         <form onSubmit={handleSubmit}>
//           <div className="brand">
//             <img src={Logo} alt="Logo" />
//             <h1>KSVID_CHAT_APP</h1>
//           </div>
//           <h2 id="heading">Login</h2>

//           <div className="field">
//             <input
//               type="text"
//               placeholder="Username"
//               name="username"
//               value={values.username}
//               onChange={handleChange}
//               className="input-field"
//             />
//           </div>

//           <div className="field">
//             <input
//               type="email"
//               placeholder="Email"
//               name="email"
//               value={values.email}
//               onChange={handleChange}
//               className="input-field"
//             />
//           </div>

//           <div className="field">
//             <input
//               type="password"
//               placeholder="Password"
//               name="password"
//               value={values.password}
//               onChange={handleChange}
//               className="input-field"
//             />
//           </div>

//           <div className="btn">
//             <button type="submit" className="button1">Login</button>
//             <Link to="/register">
//               <button type="button" className="button2">Sign Up</button>
//             </Link>
//           </div>

//         </form>
//       </FormContainer>
//       <ToastContainer position="top-right" autoClose={3000} />
//     </>
//   );
// }

// const FormContainer = styled.div`
//     height: 600px;
//     width: 500px;
//     translate: 110%;
//     position:relative;
//     background-color: #1a1a1a;
//     border-radius: 20px;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     flex-direction: column;
//     gap: 1rem;
//     padding: 2rem;
//     margin: auto;
//     margin-top: 5vh;
//     box-shadow: 0px 0px 15px rgba(0,0,0,0.3);

//     .brand {
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       gap: 0.5rem;
//     }

//     img {
//       height: 60px;
//     }

//     #heading {
//       color: white;
//       text-align: center;
//     }

//     form {
//       width: 100%;
//       display: flex;
//       flex-direction: column;
//       gap: 1rem;
//     }

//     .field {
//       width: 100%;
//       background-color: #2a2a2a;
//       border-radius: 8px;
//       padding: 0.8rem;
//       display: flex;
//       align-items: center;
//     }

//     .input-field {
//       width: 100%;
//       background: none;
//       border: none;
//       outline: none;
//       color: #eee;
//       font-size: 1rem;
//     }

//     .btn {
//       display: flex;
//       gap: 0.5rem;
//       justify-content: center;
//       margin-top: 1rem;
//     }

//     .button1, .button2 {
//       background-color: #4caf50;
//       color: white;
//       padding: 0.7rem 2rem;
//       border: none;
//       border-radius: 8px;
//       font-size: 1rem;
//       cursor: pointer;
//       transition: 0.3s;
//     }

//     .button1:hover, .button2:hover {
//       background-color: #388e3c;
//     }
//   `;
function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "", password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (handleValidation()) {
      setIsLoading(true);
      const { username, password } = values;
      const user = { username, password };
      try {
        const { data } = await axios.post(loginRoute, user);
        if (data) {
          localStorage.setItem('chat-app-user', JSON.stringify(data.user_data));
          console.log(data.user_data.isAvatarImageSet)
          if (data.user_data.isAvatarImageSet == true) {
            navigate("/chat");
          }
          else {
            navigate("/avatar");
          }
          toast.success("User logged in successfully!");
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Check the credentials");
      } finally {
        setIsLoading(false);
      }
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  function handleValidation() {
    if (values.username.trim() === "") {
      toast.error("Enter The Username");
      return false;
    }
    if (values.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    return true;
  }

  return (
    <>
      <Form>
        <form className="form" onSubmit={handleSubmit}>
          <span className="input-span">
            <label htmlFor="text" className="label">Username</label>
            <input
              placeholder="Username"
              name="username"
              type="text"
              value={values.username}
              onChange={handleChange}
              className="input-field"
              disabled={isLoading}
            /></span>

          <span className="input-span">
            <label htmlFor="password" className="label">Password</label>
            <input 
              type="password"
              placeholder="Password"
              name="password"
              value={values.password}
              onChange={handleChange}
              className="input-field"
              disabled={isLoading}
            /></span>

          <button 
            className={`submit ${isLoading ? 'loading' : ''}`} 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Logging in...</span>
              </div>
            ) : (
              'Log in'
            )}
          </button>
          <span className="span">Don't have an account? <Link to="/register">Sign up</Link></span>
        </form>
      </Form>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

const Form = styled.div`
  position: relative;
  translate: 40rem;

  .form {
    --bg-light: #efefef;
    --bg-dark: #707070;
    --clr: #58bc82;
    --clr-alpha: #9c9c9c60;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: 300px;
  }

  .form .input-span {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form input[type="text"],
  .form input[type="password"] {
    border-radius: 0.5rem;
    padding: 1rem 0.75rem;
    width: 100%;
    border: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: var(--clr-alpha);
    outline: 2px solid var(--bg-dark);
    transition: all 0.3s ease;
  }

  .form input[type="text"]:focus,
  .form input[type="password"]:focus {
    outline: 2px solid var(--clr);
  }

  .form input[disabled] {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .label {
    align-self: flex-start;
    color: var(--clr);
    font-weight: 600;
  }

  .form .submit {
    padding: 1rem 0.75rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border-radius: 3rem;
    background-color: var(--bg-dark);
    color: var(--bg-light);
    border: none;
    cursor: pointer;
    transition: all 300ms;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .form .submit:not(:disabled):hover {
    background-color: var(--clr);
    color: var(--bg-dark);
    transform: translateY(-2px);
  }

  .form .submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .loading-spinner {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 3px solid transparent;
    border-top-color: var(--bg-light);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .span {
    text-decoration: none;
    color: var(--bg-dark);
  }

  .span a {
    color: var(--clr);
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .span a:hover {
    text-decoration: underline;
  }
`

export default Register;


