
//icons
import deletePng from "../../../images/delete.png";
import editPng from "../../../images/pencil-blue-icon.png";

import { useState, useEffect } from "react";
//utils
import dateFormatter from "../../../utils/dateFormatter";
import { deactivateUser, getUsers } from "../../../utils/api";
import LoaderSpinner from "../../LoaderSpinner";
import colorCode from "../../../utils/colorCodes";
import generateHistoryKey from "../../../utils/generateHistoryKey";

function ViewUsers({ setViewOrCreate, setUserID, accountLogged }) {
  const [usersList, setUsersList] = useState(null);
  const [deactivatedUser, setDeactivatedUser] = useState(false);
  const [toggleReload, setToggleReload] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    async function populateUsers() {
      setUsersList(await getUsers());
    }
    populateUsers();
    return () => abortController.abort();
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
        const prevData = usersList.find((u) => u.user_id === Number(value));
        if (prevData && prevData.status === "Non-Active")
          window.alert("This user is already deactivated!");
        else {
          async function deactivateU() {
              setToggleReload(true);
              const newDate = new Date();
              setDeactivatedUser(
                await deactivateUser(
                  {
                    ...prevData,
                    history: [
                      ...prevData.history,
                      {
                        action_taken: "Deactivate User",
                        action_date: JSON.stringify(newDate),
                        action_by: accountLogged.name,
                        action_by_id: accountLogged.user_id,
                        action_key: generateHistoryKey(),
                        action_comment: "Deactivated User"
                      }
                    ],
                    updated_at: JSON.stringify(newDate),
                    status: "Non-Active"
                  }
                  )
              );
          }
          deactivateU();
        }
      }
  };

  useEffect(() => {
    const abortController = new AbortController();
    setUsersList(null);
    setToggleReload(false);
    return () => abortController.abort();
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
                        <span style={{ color: colorCode[u.status] }}>
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
