import { useEffect, useState } from "react";
import "./CreateUser.css";

//utils
import { createUser, getUsers } from "../../../utils/api";
import validateUserForm from "../../../utils/validation/validateUserForm";
import generateHistoryKey from "../../../utils/generateHistoryKey";
import LoaderSpinner from "../../LoaderSpinner";

function CreateUser({ accountLogged, setViewOrCreate }) {
  const newHistoryKey = generateHistoryKey();
  const newDate = new Date();
  const [createButtonDisabled, setCreateButtonDisabled] = useState(false);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    async function populateUsers() {
      setUsers(await getUsers());
    }
    populateUsers();
    return () => abortController.abort();
  }, [setViewOrCreate]);

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
    ],
    status: "Active"
  });

  const changeHandler = (e) => {
    const { id, value } = e.currentTarget;
    if(id === "role-selector") setNewUser({ ...newUser, access_level: value });
    else setNewUser({ ...newUser, [id]: value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if(newUser.access_level === "no-selection" || newUser.access_level === "no-selection") return window.alert("You must select a role for this new user!");
    //frontend validate new user data
    if (validateUserForm(newUser, users)) {
      setCreateButtonDisabled(true);
      if (window.confirm( `Do you confirm the creation of user: ${newUser.username}?` )) {
        async function createThisUser(){
          setViewOrCreate('view');
          await createUser(newUser)
        }

        createThisUser();
      }
    }
  };
  console.log(newUser)
  return (
    <section className="create-user-container">
      <h4>Create User</h4>
      {!createButtonDisabled ? 
      <form
        className="create-user-form" 
        onSubmit={submitHandler}
      >
        <div className="form-container">
        <select name="role-selector" id="role-selector" onChange={changeHandler}>
          <option value="no-selection" defaultValue>Choose Role</option>
          <option value="admin">Admin</option>
          <option value="analyst">Analyst</option>
          <option value="engineer">Engineer</option>
        </select><br/>
          <label htmlFor="name">Name ("John Doe")</label><br />
          <input type="text" id="name" name="name" onChange={changeHandler} />
          <br/>
          <label htmlFor="username">Username</label><br />
          <input
            type="username"
            id="username"
            name="username"
            onChange={changeHandler}
          />          <br/>

          <label htmlFor="password">Password</label><br />
          <input
            type="password"
            id="hash"
            name="hash"
            onChange={changeHandler}
          />
          <br/>
          <label htmlFor="email">Email Address</label><br />
          <input type="text" id="email" name="email" onChange={changeHandler} />          <br/><br/>
        </div>
        <div className="fix-button">
          <button className="submit-single-asset">Create User</button>
        </div>
      </form> : <LoaderSpinner width={45} height={45} message="New User Data" /> }
    </section>
  );
}

export default CreateUser;
