import { useEffect, useState } from 'react';

import { getUser } from '../../../utils/api';
import LoaderSpinner from '../../LoaderSpinner';

function EditUser({ accountLogged, userID }) {

  const [user, setUser] = useState(null);
  const [newUserData, setNewUserData] = useState(null);
  const defaultRadioBtn = {
    admin: false,
    engineer: false,
    analyst: false
  }
  const [buttonPlaceholder, setButtonPlaceholder] = useState(defaultRadioBtn);

  useEffect(() => {
    //get user information
    async function findUser(){
        setUser(await getUser(userID));
        if(user) setNewUserData(user);
    }
    findUser();
  }, []);

  useEffect(() => {
    if(user){ //set radio button to default access level
        setButtonPlaceholder({...defaultRadioBtn, [user.access_level]: true})
    }
  }, [user, setUser]);

  const changeHandler = (e) => {
    const { id, type, value } = e.currentTarget;
    if(type === "radio"){
        setButtonPlaceholder({...defaultRadioBtn, [id]: true})
        setNewUserData({...newUserData, access_level: id});
    }
    else{
        setNewUserData({...newUserData, [id]: value});
    }
  };

  const submitHandler = () => {


  };


  return (
    <section className="create-user-container upload-container-style">
    <h4>Update User Data</h4>
    {user ? 
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
              checked={buttonPlaceholder.admin}
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
        <button className="submit-single-asset">Update User</button>
      </div>
    </form> : <LoaderSpinner height={45} width={45} message={"User Data"} />}
  </section>
  );
}

export default EditUser;
