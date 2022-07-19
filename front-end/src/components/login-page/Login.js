import "./Login.css";
import { useEffect, useState } from "react";

//components
import CreateAdmin from "./CreateAdmin";

//utils
import { getUsers } from "../../utils/api";

const bcrypt = require("bcryptjs");

function Login({ accountLogged, setAccountLogged }) {
  const [users, setUsers] = useState(null);
  const [createAdmin, setCreateAdmin] = useState(false);
  const defaultUser = {
    username: "",
    hash: "",
  };
  const [user, setUser] = useState(defaultUser);

  useEffect(() => {
    const abortController = new AbortController();
    async function loadUsers() {
      setUsers(await getUsers());
    }
    loadUsers();
    return abortController.abort();
  }, [setCreateAdmin, createAdmin]);

  useEffect(() => {
    if (users) {
      if (
        users.length === 0 ||
        !users.find((user) => user.access_level === "admin")
      ) {
        //no users or administrators exist in the system
        setCreateAdmin(true);
      }
    }
  }, [users, setUsers]);

  const handleChange = (e) => {
    const { id, value } = e.currentTarget;
    setUser({...user, [id]: value })
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const foundAcct = users.filter(acct => acct.username === user.username);
    if(foundAcct && foundAcct.length !== 0){
      if(bcrypt.compareSync(user.hash, foundAcct[0].hash)) //passwords hash compare is good
      {
        localStorage.setItem('acctLogged',  JSON.stringify({logged: true, account: foundAcct}));
        await setAccountLogged(JSON.parse(localStorage.getItem('acctLogged')));
      }
    }
  };

  //login with 'enter' key press on form
  const handleKeyPress = (e) => {
    if(e.keyCode === 13) handleClick();
  }

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
          {createAdmin ? (
            <CreateAdmin setCreateAdmin={setCreateAdmin}/>
          ) : (
            <>
              <h2>Sign In</h2>
              <form onKeyPress={handleKeyPress}>
                <label htmlFor="username">Username</label>
                <br />
                <br />
                <input id="username" type="text" onChange={handleChange} value={user.username}/>
                <br />
                <br />
                <label htmlFor="pass">Password</label>
                <br />
                <br />
                <input id="hash" type="password" onChange={handleChange} value={user.hash} />
                <div className="signin-button">
                <button type="submit" onClick={handleClick}>Login</button>
              </div>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default Login;
