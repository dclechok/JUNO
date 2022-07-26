import { useState, useEffect } from "react";
//components
import LoaderSpinner from "../../LoaderSpinner";
import ViewUsers from "./ViewUsers";
import CreateUser from "./CreateUser";
import EditUser from "./EditUser";
//utils
import { getUsers } from "../../../utils/api";

function ManageUsers({ accountLogged }) {
  const [users, setUsers] = useState(null);
  const [userID, setUserID] = useState(null);
  const defaultButtonStyle = {
    view: "button-link",
    create: "button-link",
  };
  const [buttonStyle, setButtonStyle] = useState(defaultButtonStyle);
  const [viewOrCreate, setViewOrCreate] = useState("view");

  useEffect(() => {
    async function populateUsers() {
      setUsers(await getUsers());
    }
    populateUsers();
  }, []);

  useEffect(() => {
    setButtonStyle({ ...buttonStyle, [viewOrCreate]: "active-button-link" }); //default to View
  }, [viewOrCreate, setViewOrCreate]);

  const handleClick = (e) => {
    e.preventDefault();
    const { id } = e.currentTarget;
    setViewOrCreate(id);
    setButtonStyle({ ...defaultButtonStyle, [id]: "active-button-link" });
  };

  return (
    <>
      {users && users.length !== 0 ? (
        <div>
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
          {viewOrCreate === "view" && <ViewUsers setViewOrCreate={setViewOrCreate} users={users} setUserID={setUserID} />}
          {viewOrCreate === "create" && <CreateUser users={users} accountLogged={accountLogged} />}
          {viewOrCreate === "edit" && <EditUser accountLogged={accountLogged} userID={userID} setViewOrCreate={setViewOrCreate} />}
        </div>
      ) : (
        <LoaderSpinner width={45} height={45} message={"User Data"}/>
      )}
    </>
  );
}

export default ManageUsers;
