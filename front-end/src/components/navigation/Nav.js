import "./Nav.css";
import logoTwo from "../../images/logo2.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

function Nav({ setLoadAssets, loadAssets }) {

  const navigate = new useNavigate();
  const defaultButtonState = {
    dashboard: "middleNavButton",
    settings: "middleNavButton"
  };
  const [buttonState, setButtonState] = useState(defaultButtonState);

  const handleSubmit = (e) => {
    const { id = "" } = e.currentTarget;
    console.log(id);
    setLoadAssets(!loadAssets);
    if (id === "dashboard") navigate(`/`);
    else if (id === "settings") navigate(`/admin-panel`);
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
