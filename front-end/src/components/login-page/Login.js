import "./Login.css";
import { useEffect, useState } from "react";

//components
import CreateAdmin from "./CreateAdmin";

//utils
import { getUsers } from "../../utils/api";

function Login() {
  const [users, setUsers] = useState([]);
  const [createAdmin, setCreateAdmin] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    async function loadUsers() {
      setUsers(await getUsers());
    }
    if(users.length === 0 || !users.find(user => user.access_level === "admin")){
      //no users or administrators exist in the system
      setCreateAdmin(true);
    }

    return abortController.abort();
  }, []);

  useEffect(() => {
    // console.log("create admin", createAdmin);
  }, [createAdmin, setCreateAdmin]);

  return (
    <main>
      <div className="login-container">
        <div className="title-header">
        <h1>
          JUN<span style={{ color: "rgb(255, 239, 138)" }}>O</span>
        </h1>
        <h3>Asset Management System</h3>
        <h4>Powered by Mawson Infrastructure Group</h4>
        </div>
        <div className="login-form-container">
        {createAdmin ? 
        <CreateAdmin /> :<>
          <h2>Sign In</h2>
            <form>
              <label htmlFor="user">Username</label>
              <br />
              <br />
              <input id="user" type="text" />
              <br />
              <br />
              <label htmlFor="pass">Password</label>
              <br />
              <br />
              <input id="pass" type="password" />
            </form>
          <div className="signin-button">
            <button>Login</button>
          </div></>
          }
        </div>
      </div>
    </main>
  );
}

export default Login;
