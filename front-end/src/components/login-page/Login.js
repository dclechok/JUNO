import "./Login.css";
import { useEffect, useState } from "react";

//active directory
import { useMsal } from "@azure/msal-react";

//utils
import LoaderSpinner from "../LoaderSpinner";
import { _ } from "keygenerator/lib/keygen";

function Login({ setCurrentAcct }) {
  const [loggingIn, setLoggingIn] = useState(false);

  const { instance } = useMsal();
  const thisAcct = instance.getActiveAccount();

  const handleClick = (e) => {
    e.preventDefault();
    setLoggingIn(true);
    instance.loginPopup({ scopes: ["user.read"] });
  };
  //login with 'enter' key press on form
  const handleKeyPress = (e) => {
    if (e.keyCode === 13) handleClick();
  };

  useEffect(() => {
    if(thisAcct) setCurrentAcct(thisAcct);
  }, [thisAcct]);

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

          <form onKeyPress={handleKeyPress}>
            <div className="signin-button">
              {!loggingIn ? (
                <button type="submit" onClick={handleClick}>
                  Login
                </button>
              ) : (
                <div className="center-spinner">
                  <LoaderSpinner width={45} height={45} message={"Login..."} />
                </div>
              )}
            </div>
          </form>
      </div>
    </main>
  );
}

export default Login;
