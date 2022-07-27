import deletePng from "../../../images/delete.png";
import editPng from "../../../images/pencil-blue-icon.png";

import '../AdminPanelTables.css';
import { useState, useEffect } from "react";
//utils
import dateFormatter from "../../../utils/dateFormatter";
import { deactivateUser, getUsers } from "../../../utils/api";
import LoaderSpinner from "../../LoaderSpinner";

function ViewUsers({ setViewOrCreate, setUserID, accountLogged }) {
  const [usersList, setUsersList] = useState(null);
  const [deactivatedUser, setDeactivatedUser] = useState(false);
  const [toggleReload, setToggleReload] = useState(false);

  const colorStatus = {
    "Active": "rgb(240, 240, 163)",
    "Non-Active": "rgb(197, 136, 42)",
  };

  useEffect(() => {
    async function populateUsers() {
      setUsersList(await getUsers());
    }
    populateUsers();
  }, [setViewOrCreate, deactivatedUser, setDeactivatedUser, toggleReload, setToggleReload]);

  const clickHandler = (e) => {
    e.preventDefault()
    const { id, value } = e.currentTarget;
    if (id === "editUser") {
      setViewOrCreate("edit");
      setUserID(value); //this is the userID we will use when editing
    }
    if (id === "deactivateUser")
      if (
        window.confirm(
          "Are you sure you wish to deactivate this user? (Currently, there is no way to reverse this!)"
        )
      ) {
        const prevData = usersList.filter((u) => u.user_id === Number(value));
        if (prevData && prevData[0].status === "Non-Active")
          window.alert("This user is already deactivated!");
        else {
          async function deactivateU() {
              setToggleReload(true);
              setDeactivatedUser(
                await deactivateUser(prevData, accountLogged)
              );
          }
          deactivateU();
        }
      }
  };

  useEffect(() => {
    setUsersList(null);
    setToggleReload(false);
  }, [deactivatedUser, setDeactivatedUser]);

  return (
    <>
      {usersList && !toggleReload ?  (
        <div>
          <p>Total Users: {usersList.length}</p>
          <table>
            <tbody>
              <tr>
                <th>
                  <b>User ID</b>
                </th>
                <th>
                  <b>Name</b>
                </th>
                <th>
                  <b>Username</b>
                </th>
                <th>
                  <b>Access Level</b>
                </th>
                <th>
                  <b>Status</b>
                </th>
                <th>
                  <b>Date Created</b>
                </th>
                <th>
                  <b>Edit</b>
                </th>
                <th>
                  <b>Deactivate</b>
                </th>
              </tr>
              {usersList &&
                usersList.length !== 0 &&
                usersList.map((u, key) => {
                  return (
                    <tr key={key}>
                      <td>{u.user_id}</td>
                      <td>{u.name}</td>
                      <td>{u.username}</td>
                      <td>{u.access_level.toUpperCase()}</td>
                      <td>
                        <span style={{ color: colorStatus[u.status] }}>
                          {u.status}
                        </span>
                      </td>
                      <td>{dateFormatter(u.created_at)}</td>
                      <td className="delete-icon-td">
                        <button
                          className="image-button"
                          id="editUser"
                          value={u.user_id}
                          onClick={clickHandler}
                        >
                          <img src={editPng} alt="edit user" />
                        </button>
                      </td>
                      <td className="delete-icon-td">
                        <button
                          className="image-button"
                          id="deactivateUser"
                          value={u.user_id}
                          onClick={clickHandler}
                        >
                          <img src={deletePng} alt="deactivate user" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : (
        <LoaderSpinner height={45} width={45} message={"User List"} />
      )}
    </>
  );
}

export default ViewUsers;
