import './NavLinks.css';

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function NavLinks({ setLoadAssets, loadAssets }) {
    const navigate = new useNavigate();
    const defaultButtonState = {
        dashboard: 'nav-list-inactive',
        assetList: 'nav-list-inactive',
        importAssets: 'nav-list-inactive'

      };
      const [buttonState, setButtonState] = useState({...defaultButtonState, dashboard: 'nav-list-active'});
    const handleSubmit = (e) => {
        const { id } = e.currentTarget;
        setButtonState({...defaultButtonState, [id]: 'nav-list-active'});
        if (id === "dashboard") {
            setLoadAssets(!loadAssets);
            navigate(`/`);
        }else if(id === "assetList"){
            navigate(`/asset_list`);
        }
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
    console.log(buttonState)
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
                    className={buttonState.assetList}
                    id="assetList"
                    onClick={handleSubmit}
                >
                    View Assets
                </button>
                </li>
                <li>
                    <button
                        className={buttonState.importAssets}
                        id="importAssets"
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