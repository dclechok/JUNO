import "./AdminPanel.css";
import { useState, useEffect } from "react";

//components
import ManageJobSites from "./ManageJobSites";

function AdminPanel() {
  const defaultButtonState = {
    manageUsers: "button-link",
    manageJobSites: "button-link",
    manageRequests: "button-link",
  };
  const [buttonState, setButtonState] = useState(defaultButtonState); //"button-link" (inactive) or "active-button-link" (active) classes
  const [renderPage, setRenderPage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { id } = e.currentTarget;
    setButtonState({ ...defaultButtonState, [id]: "active-button-link" });
    setRenderPage(id);
  };

  useEffect(() => {
    setButtonState({
      ...defaultButtonState,
      manageJobSites: "active-button-link",
    });
    setRenderPage("manageJobSites");
  }, []);

  return (
    <div className="single-asset-render admin-panel-container">
      <h1>Admin Panel</h1>
      <header className="single-asset-header container-style center-header">
        <div>
          <span style={{ color: "black" }}>
            [
            <button
              id="manageJobSites"
              className={buttonState.manageJobSites}
              onClick={handleSubmit}
            >
              Manage Job Sites
            </button>
            ] [
            <button
              id="manageUsers"
              className={buttonState.manageUsers}
              onClick={handleSubmit}
            >
              Manage Users
            </button>
            ]
          </span>
        </div>
      </header>
      <section className="container-style management-body">
        {renderPage === "manageJobSites" && <ManageJobSites />}
      </section>
    </div>
  );
}

export default AdminPanel;
