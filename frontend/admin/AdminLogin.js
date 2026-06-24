import { useState } from "react";
import { useRouter } from "next/router";
import API_URL from "../utils/api";

export default function AdminLogin() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const login = async () => {

    if(!username.trim() || !password.trim()){

  alert(
    "Please enter username and password."
  );

  return;

}

    const response = await fetch(
      `${API_URL}/admin/login`,
      {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      }
    );

    const data = await response.json();

    if(data.status === "success"){

      router.push(
        "/admin-dashboard"
      );

    }else{

      alert(data.message);

    }

  };

  return (

  <div className="admin-login-page">

    <div className="admin-login-card">

      <h1 className="admin-login-title">
        Admin Login
      </h1>

      <p className="admin-login-subtitle">
        Secure Administrator Access
      </p>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e)=>
          setUsername(e.target.value)
        }
        className="admin-login-input"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>
          setPassword(e.target.value)
        }
        className="admin-login-input"
      />

      <button
        className="admin-login-btn"
        onClick={login}
      >
        Login
      </button>

    </div>

  </div>

);

}