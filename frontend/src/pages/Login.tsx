import React, { useState } from "react";
import axios from "axios";
import { userEmail } from "../store/atoms/user";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const naviagte = useNavigate();
  const setUserEmail = useSetRecoilState(userEmail);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/signup", {
        firstName,
        lastName,
        email,
        role: "Buyer",
      });
      setUserEmail(response.data.newUser.email);
      alert("hi");
      if (response) {
        naviagte("/players");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
