import { useEffect, useState } from "react";
import "./CreateUser.css";

import { createUser } from "../../../utils/api";
//utils
import validateCreateUser from "../../../utils/validation/validateCreateUser";
import generateHistoryKey from "../../../utils/generateHistoryKey";
import LoaderSpinner from "../../LoaderSpinner";

function CreateUser({ users, accountLogged, setViewOrCreate }) {
  const newHistoryKey = generateHistoryKey();
  const newDate = new Date();
  const [createButtonDisabled, setCreateButtonDisabled] = useState(false);
  const [newUser, setNewUser] = useState({
    access_level: "",
    name: "",
    username: "",
    hash: "",
    email: "",
    history: [
      {
        action_date: newDate,
        action_taken: "Create User",
        action_by: accountLogged.account[0].name,
        action_by_id: accountLogged.account[0].user_id,
        history_key: newHistoryKey
      }
    ]
  });

  const changeHandler = (e) => {
    const { id, value, type } = e.currentTarget;
    if (type === "radio") setNewUser({ ...newUser, access_level: value });
    else setNewUser({ ...newUser, [id]: value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    //frontend validate new user data
    setCreateButtonDisabled(true);
    if (validateCreateUser(newUser, users)) {
      if (window.confirm( `Do you confirm the creation of user: ${newUser.username}?` )) {
        async function createThisUser(){
          if(await createUser(newUser)) setViewOrCreate('view');
        }
        createThisUser();
      }
    }
  };

  useEffect(() => {

  }, []);

  return (
    <section className="create-user-container upload-container-style">
      <h4>Create User</h4>
      {!createButtonDisabled ? 
      <form
        className="form-container create-user-form"
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
              />

              <input
                type="radio"
                id="engineer"
                name="access_level"
                value="engineer"
                onChange={changeHandler}
              />

              <input
                type="radio"
                id="analyst"
                name="access_level"
                value="analyst"
                onChange={changeHandler}
              />
            </div>
          </div>
        </fieldset>

        <div className="create-space">
          <label htmlFor="name">Name ("John Doe")</label>
          <input type="text" id="name" name="name" onChange={changeHandler} />

          <label htmlFor="username">Username</label>
          <input
            type="username"
            id="username"
            name="username"
            onChange={changeHandler}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="hash"
            name="hash"
            onChange={changeHandler}
          />

          <label htmlFor="email">Email Address</label>
          <input type="text" id="email" name="email" onChange={changeHandler} />
        </div>
        <div className="fix-button">
          <button className="submit-single-asset">Create User</button>
        </div>
      </form> : <LoaderSpinner width={45} height={45} message="New User Data" /> }
    </section>
  );
}

export default CreateUser;
