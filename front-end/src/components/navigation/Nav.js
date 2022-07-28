import "./Nav.css";
import logoTwo from "../../images/logo2.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';
function Nav({ setLoadAssets, loadAssets, accountLogged, setAccountLogged }) {

  const navigate = new useNavigate();
  const defaultButtonState = {
    dashboard: "middleNavButton",
    settings: "middleNavButton"
  };
  const [buttonState, setButtonState] = useState(defaultButtonState);


  const sessionTime = 1000 * 60 * 1; //15 minutes of session time
  const promptTimeout = 1000 * 60 * 1; //1 minute prompt timeout until logout onIdle
  
  const onIdle = () => {
  //when prompt timeout is reached onIdle is called
      console.log('log out');
      setAccountLogged(null);
      localStorage.clear();
      navigate('/');
  }
  const onActive = () => {
      console.log('carry on');
  };
  
  const onPrompt = () => {
    // window alert
    window.alert(`You have been idle for ${sessionTime} minutes. You will be automatically logged out in ${promptTimeout} seconds.`);
  }

  useIdleTimer({ onIdle, onActive, onPrompt, timeout: sessionTime, promptTimeout: promptTimeout });




  const handleSubmit = (e) => {
    const { id = "" } = e.currentTarget;

    if (id === "dashboard"){
      setLoadAssets(!loadAssets)
      navigate(`/`);
    } 
    else if (id === "settings"){
      if(accountLogged.account[0].access_level === 'admin') navigate(`/admin-panel`);
      else window.alert("You must be an Administrator to view this component.");
    }
    else if(id === "import-assets"){
      if(accountLogged.account[0].access_level === 'admin' || accountLogged.account[0].access_level === 'engineer') navigate(`/import-assets`);
      else window.alert("You must be an Administrator or Engineer to view this component.");
    }
    else navigate(`/${id}`);
    
    setButtonState({...defaultButtonState, [id]: 'middleNavButtonActive'});
  };

  useEffect(() => {
    setButtonState({...defaultButtonState, dashboard: 'middleNavButtonActive'});
  }, []);

  return (
    <div className="nav-fixed">
      <nav>
        <div className="leftNav">
          <h1>
            JUN<span style={{ color: "rgb(255, 239, 138)" }}>O</span>
          </h1>
        </div>
        <div className="middleNav">
          <div className="dropdown">
            <button className={buttonState.dashboard} id="dashboard" onClick={handleSubmit}>
              Dashboard
            </button>
            <div className="dropdown-content">
              <button className="dropdown-button" id="import-assets" onClick={handleSubmit}>
                Import Assets
              </button>
              <button className="dropdown-button" id="history" onClick={handleSubmit}>Asset History</button>
            </div>
          </div>

          <div className="dropdown">
            <button className={buttonState.settings} id="settings" onClick={handleSubmit}>
              Admin Panel
            </button>
          </div>
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
