import { useEffect, useState } from "react";

//utils
import { getUser, updateUser } from "../../../utils/api";
import LoaderSpinner from "../../LoaderSpinner";
import generateHistoryKey from "../../../utils/generateHistoryKey";

function EditUser({ accountLogged, userID, setViewOrCreate }) {
  const [user, setUser] = useState(null);
  const [newUserData, setNewUserData] = useState(null);
  const [editUserSuccess, setEditUserSuccess] = useState(null);

  const defaultRadioBtn = {
    admin: false,
    engineer: false,
    analyst: false,
  };
  const [buttonPlaceholder, setButtonPlaceholder] = useState(defaultRadioBtn);

  useEffect(() => {
    //get user information
    const abortController = new AbortController();
    async function findUser() {
      setUser(await getUser(userID));
    }
    findUser();
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    if (user) {
      setButtonPlaceholder({ ...defaultRadioBtn, [user.access_level]: true });
      setNewUserData({ ...user, hash: "" });
    }
    return () => abortController.abort();
  }, [user]);

  const changeHandler = (e) => {
    const { id, type, value } = e.currentTarget;
    if (type === "radio") {
      setButtonPlaceholder({ ...defaultRadioBtn, [id]: true });
      setNewUserData({ ...user, access_level: id });
    } else {
      setNewUserData({ ...newUserData, [id]: value });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    async function editUser() {
      const newDate = new Date();
      setEditUserSuccess(await updateUser(
        {
          ...newUserData, 
          history: [
            ...newUserData.history,
            {
              action_taken: "Edit User",
              action_date: JSON.stringify(newDate),
              action_by: accountLogged.account[0].name,
              action_by_id: accountLogged.account[0].user_id,
              action_key: generateHistoryKey(),
              action_comment: "Edited User Details"
            },
          ], 
          updated_at: JSON.stringify(newDate)
        },
        userID
        ));
    }
    editUser();
  };

  useEffect(() => {
    const abortController = new AbortController();
    if(editUserSuccess) setViewOrCreate('view');
    return () => abortController.abort();
  }, [editUserSuccess]);

  return (
    <section className="create-user-container">
      <h4>Edit User</h4>
      {user && newUserData ? (
        <form
          className="create-user-form"
          onSubmit={submitHandler}
        >
          <fieldset>
            <legend>User Access Level</legend>
            <div className="radio-buttons-container">
              <div className="flex-header">
                <label htmlFor="admin">Admin</label>
                <label htmlFor="engineer">Engineer</label>
                <label htmlFor="analyst">Analyst</label>
              </div>
              <div className="flex-buttons">
                <input
                  type="radio"
                  id="admin"
                  name="access_level"
                  value="admin"
                  onChange={changeHandler}
                  checked={buttonPlaceholder.admin}
                  autoComplete="off"
                />

                <input
                  type="radio"
                  id="engineer"
                  name="access_level"
                  value="engineer"
                  onChange={changeHandler}
                  checked={buttonPlaceholder.engineer}
                />

                <input
                  type="radio"
                  id="analyst"
                  name="access_level"
                  value="analyst"
                  onChange={changeHandler}
                  checked={buttonPlaceholder.analyst}
                  autoComplete="off"
                />
              </div>
            </div>
          </fieldset>

          <div className="form-container">
            <label htmlFor="name">Name ("John Doe")</label><br/>
            <input
              type="text"
              id="name"
              name="name"
              onChange={changeHandler}
              placeholder={newUserData.name}
            /><br/>

            <label htmlFor="username">Username</label><br/>
            <input
              type="username"
              id="username"
              name="username"
              onChange={changeHandler}
              placeholder={newUserData.username}
              autoComplete="off"
            /><br/>

            <label htmlFor="password">Password</label><br/>
            <input
              type="password"
              id="hash"
              name="hash"
              onChange={changeHandler}
              autoComplete="off"
            /><br/>

            <label htmlFor="email">Email Address</label><br/>
            <input
              type="text"
              id="email"
              name="email"
              onChange={changeHandler}
              placeholder={newUserData.email}
            /><br/>
          </div>
          <div className="fix-button">
            <button className="submit-single-asset">Update User</button>
          </div>
        </form>
      ) : (
        <LoaderSpinner height={45} width={45} message={"User Data"} />
      )}
    </section>
  );
}

export default EditUser;
