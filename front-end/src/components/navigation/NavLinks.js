import './NavLinks.css';

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function NavLinks() {
    const navigate = new useNavigate();
    const defaultButtonState = {
        dashboard: "middleNavButton",
        settings: "middleNavButton",
      };
      const [buttonState, setButtonState] = useState(defaultButtonState);

      useEffect(() => {
        const abortController = new AbortController();
        setButtonState({
          ...defaultButtonState,
          dashboard: "middleNavButtonActive",
        });
        return () => abortController.abort();
      }, []);
    
    const handleSubmit = (e) => {
        const { id = "" } = e.currentTarget;
        console.log(id)
        // if (id === "dashboard") {
        //     setLoadAssets(!loadAssets);
        //     navigate(`/`);
        // } else if (id === "settings") {
        //     if (accountLogged.access_level === "Juno.Admin")
        //         navigate(`/admin-panel`);
        //     else window.alert("You must be an Administrator to view this component.");
        // } else if (id === "import-assets") {
        //     if (
        //         accountLogged.access_level === "Juno.Admin" ||
        //         accountLogged.access_level === "Juno.Engineer"
        //     )
        //         navigate(`/import-assets`);
        //     else
        //         window.alert(
        //             "You must be an Administrator or Engineer to view this component."
        //         );
        // } else navigate(`/${id}`);    setButtonState({ ...defaultButtonState, [id]: "middleNavButtonActive" });
    };

    return (
        <div className="menu-options">
            <ul className='nav-list'>
                <li>
                <button
                    className={buttonState.dashboard}
                    id="dashboard"
                    onClick={handleSubmit}
                >
                    Dashboard
                </button>
                </li>
                <li>
                <button
                    className={buttonState.viewAssets}
                    id="view-assets"
                    onClick={handleSubmit}
                >
                    View Assets
                </button>
                </li>
                <li>
                    <button
                        className="dropdown-button"
                        id="import-assets"
                        onClick={handleSubmit}
                    >
                        Import Assets
                    </button>
                    </li>
                    <li>
                    <button
                        className="dropdown-button"
                        id="history"
                        onClick={handleSubmit}
                    >
                        History Log
                    </button>
                    </li>
                    <li>
                <button
                    className={buttonState.settings}
                    id="settings"
                    onClick={handleSubmit}
                >
                    Admin Panel
                </button>
                </li>
                </ul>
        </div>
    )
}

export default NavLinks;