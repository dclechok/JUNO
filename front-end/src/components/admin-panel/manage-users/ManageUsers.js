import { useState, useEffect } from "react";
//components
import LoaderSpinner from "../../LoaderSpinner";
import ViewUsers from "./ViewUsers";
import CreateUser from "./CreateUser";
import EditUser from "./EditUser";
import '../AdminPanelTables.css';

function ManageUsers({ accountLogged }) {
  // const [users, setUsers] = useState(null);
  const [userID, setUserID] = useState(null);
  const defaultButtonStyle = {
    view: "button-link",
    create: "button-link",
  };
  const [buttonStyle, setButtonStyle] = useState(defaultButtonStyle);
  const [viewOrCreate, setViewOrCreate] = useState("view");

  useEffect(() => {
    setButtonStyle({ ...defaultButtonStyle, [viewOrCreate]: "active-button-link" }); //default to View
  }, [viewOrCreate, setViewOrCreate]);

  const handleClick = (e) => {
    e.preventDefault();
    const { id } = e.currentTarget;
    setViewOrCreate(id);
    setButtonStyle({ ...defaultButtonStyle, [id]: "active-button-link" });
  };

  console.log(viewOrCreate)
  return (
    <>
        <div className="admin-panel-container">
          <span style={{ color: "black" }}>
            [
            <button
              className={buttonStyle.view}
              id="view"
              onClick={handleClick}
            >
              View Users
            </button>
            ]
          </span>
          &nbsp;
          <span style={{ color: "black" }}>
            [
            <button
              className={buttonStyle.create}
              id="create"
              onClick={handleClick}
            >
              Create User
            </button>
            ]
          </span>
          {viewOrCreate === "view" && <ViewUsers setViewOrCreate={setViewOrCreate} accountLogged={accountLogged} setUserID={setUserID} />}
          {viewOrCreate === "create" && <CreateUser accountLogged={accountLogged} setViewOrCreate={setViewOrCreate} />}
          {viewOrCreate === "edit" && <EditUser accountLogged={accountLogged} userID={userID} setViewOrCreate={setViewOrCreate} />}
        </div>
    </>
  );
}

export default ManageUsers;
