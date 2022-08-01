import "./Login.css";
import { useEffect, useState } from "react";

//components
import CreateAdmin from "./CreateAdmin";

//utils
import { getUsers } from "../../utils/api";
import LoaderSpinner from "../LoaderSpinner";

const bcrypt = require("bcryptjs");

function Login({ accountLogged, setAccountLogged }) {
  const [users, setUsers] = useState(null);
  const [createAdmin, setCreateAdmin] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

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
        setAccountLogged(null);
        localStorage.clear();
        setCreateAdmin(true);
      }
    }
  }, [users, setUsers]);

  const handleChange = (e) => {
    const { id, value } = e.currentTarget;
    setUser({ ...user, [id]: value });
  };

  const handleClick = (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setErrorMessage(null);
    async function login() {

      const foundAcct = users.filter((acct) => acct.username === user.username);
      if (foundAcct && foundAcct.length !== 0) {
        if (bcrypt.compareSync(user.hash, foundAcct[0].hash)) {
          //passwords hash compare is good
          localStorage.setItem(
            "acctLogged",
            JSON.stringify({ logged: true, account: foundAcct })
          );
          if (
            await setAccountLogged(
              JSON.parse(localStorage.getItem("acctLogged"))
            )
          )
            setErrorMessage("Successful Login!");
        } else {
          setErrorMessage("Incorrect Username/Password!");
          // setLoggingIn(false);
        }
      } else {
        setErrorMessage("Account not found!");
        // setLoggingIn(false);
      }
    }
    login();
  };

  useEffect(() => {
    if (errorMessage) setLoggingIn(false);
  }, [setErrorMessage, errorMessage, loggingIn, setLoggingIn, setAccountLogged, accountLogged]);

  //login with 'enter' key press on form
  const handleKeyPress = (e) => {
    if (e.keyCode === 13) handleClick();
  };

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
        <>
          {users ? (
            <div className="login-form-container">
              {createAdmin ? (
                <CreateAdmin setCreateAdmin={setCreateAdmin} />
              ) : (
                <>
                  <h2>Sign In</h2>
                  <form onKeyPress={handleKeyPress}>
                    <label htmlFor="username">Username</label>
                    <br />
                    <br />
                    <input
                      id="username"
                      type="text"
                      onChange={handleChange}
                      value={user.username}
                    />
                    <br />
                    <br />
                    <label htmlFor="pass">Password</label>
                    <br />
                    <br />
                    <input
                      id="hash"
                      type="password"
                      onChange={handleChange}
                      value={user.hash}
                    />
                    <div className="signin-button">
                      {!loggingIn ? (
                        <button type="submit" onClick={handleClick}>
                          Login
                        </button>
                      ) : (
                        <div className="center-spinner">
                          <LoaderSpinner width={45} height={45} />
                        </div>
                      )}
                    </div>
                    {!loggingIn && (
                      <p className="error-message">{errorMessage}</p>
                    )}
                  </form>
                </>
              )}
            </div>
          ) : (
            <LoaderSpinner width={45} height={45} message="Login Menu" />
          )}
        </>
      </div>
    </main>
  );
}

export default Login;
