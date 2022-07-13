import './AdminPanel.css';

import { useState } from 'react';

function AdminPanel(){
    const defaultButtonState = {
        manageUsers: "button-link", 
        manageJobSites: "button-link",
        manageRequests: "button-link",
      };
      const [buttonState, setButtonState] = useState(defaultButtonState); //"button-link" (inactive) or "active-button-link" (active) classes
      
    const handleSubmit = (e) => {
        e.preventDefault();
        const { id } = e.currentTarget;
        setButtonState({...defaultButtonState, [id]: "active-button-link"});
    };

    return (
        <div className="single-asset-render admin-panel-container">
          <h1>Admin Panel</h1>
            <header className="single-asset-header container-style center-header">
              <div>
                <span style={{color: "black"}}>
                [<button id="manageUsers" className={buttonState.manageUsers} onClick={handleSubmit}>
                  Manage Users
                </button>]
                [<button id="manageJobSites" className={buttonState.manageJobSites} onClick={handleSubmit}>
                  Manage Job Sites
                </button>]
                [<button id="manageRequests" className={buttonState.manageRequests} onClick={handleSubmit}>
                  Manage Requests
                </button>]
                </span>
              </div>
            </header>
            <section className="container-style management-body">
                <p>Test</p>
            </section>    
      </div>
    );
}

export default AdminPanel;