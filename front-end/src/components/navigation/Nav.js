import "./Nav.css";
import logoTwo from "../../images/logo2.png";

import { useIdleTimer } from "react-idle-timer";

//active directory
import { useMsal } from "@azure/msal-react";

function Nav({ setLoadAssets, loadAssets, accountLogged, setAccountLogged, setIdlePrompt, idlePrompt }) {

  const { instance } = useMsal();
  const currentAcct = instance.getActiveAccount();


  const sessionTime = 1000 * 60 * 15; //15 minutes of session time
  const promptTimeout = 1000 * 60 * 0.5; //30 second prompt timeout until logout onIdle

  const onIdle = async () => {
    //when prompt timeout is reached onIdle is called
    setAccountLogged(null); //clear state storage
    await instance.logoutRedirect({
      account: currentAcct,
      postLogoutRedirectUri: "/"
    });
  };

  const onPrompt = () => {
    // window alert
    setIdlePrompt(true);
    document.addEventListener('mousemove', () => {
      setIdlePrompt(false)
      sessionTimer.reset();
    });
  };

  const sessionTimer = useIdleTimer({
    onIdle,
    onPrompt,
    timeout: sessionTime,
    promptTimeout: promptTimeout,
  });

  return (
    <div className="nav-fixed">
      <nav>
        <div className="leftNav">
          <h1>
            JUN<span style={{ color: "rgb(255, 239, 138)" }}>O</span>
          </h1>
        </div>
        

        <div className="rightNav">
          <a href="https://mawsoninc.com/">
            <img alt="logo" src={logoTwo} />
          </a>
        </div>
      </nav>
    </div>
  );
}

export default Nav;
