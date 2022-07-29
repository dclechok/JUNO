import { useEffect, useState } from "react";

//utils
import { createUser } from "../../utils/api";
import generateHistoryKey from "../../utils/generateHistoryKey";
import validateCreateUser from "../../utils/validation/validateCreateUser";

function CreateAdmin({ setCreateAdmin }) {
  const newHistoryKey = generateHistoryKey();
  const newDate = new Date();
  const defaultUserData = {
    username: "",
    hash: "",
    email: "",
    name: "",
    access_level: "admin",
    history: [
      {
        action_date: newDate,
        action_taken: "Create User",
        action_by: "Server Admin",
        action_by_id: "Server Admin",
        history_key: newHistoryKey
      }
    ],
    status: "Active"
  };
  const [userData, setUserData] = useState(defaultUserData);
  const [newAdmin, setNewAdmin] = useState(null);

  const changeHandler = (e) => {
    const { id, value } = e.currentTarget;
    setUserData({ ...userData, [id]: value });
  };

  const submitHandler = (e) => {
    //frontend validate user data here before submitting
    e.preventDefault();
    async function createNewAdmin(){
      setNewAdmin(await createUser(userData));
    }
    if(validateCreateUser(userData)) createNewAdmin();

  };
  
  useEffect(() => {
    if(newAdmin) setCreateAdmin(false);
  }, [setNewAdmin, newAdmin]);

  return (
    <>
      <div className="login-header">
        <h3>No User/Admin Account Exists!</h3>
        <h5>
          <span style={{ textAlign: "center" }}>
            One must be created before proceeding.
          </span>
        </h5>
      </div>
      <form onSubmit={submitHandler}>
        <label htmlFor="username">Username</label>
        <br />
        <br />
        <input
          id="username"
          type="text"
          onChange={changeHandler}
          value={userData.username}
        />
        <br />
        <br />
        <label htmlFor="hash">Password</label>
        <br />
        <br />
        <input
          id="hash"
          type="password"
          onChange={changeHandler}
          value={userData.hash}
        />
        <br />
        <br />
        <label htmlFor="email">Email</label>
        <br />
        <br />
        <input
          id="email"
          type="text"
          onChange={changeHandler}
          value={userData.email}
        />
        <br />
        <br />
        <label htmlFor="name">Name (First Last)</label>
        <br />
        <br />
        <input
          id="name"
          type="text"
          onChange={changeHandler}
          value={userData.name}
        />
        <div className="signin-button">
          <button type="submit">
            Create
          </button>
        </div>
      </form>
    </>
  );
}

export default CreateAdmin;
