import { useState } from 'react';

import { createUser } from '../../utils/api';

function CreateAdmin() {
  
  const defaultUserData = {
    username: '',
    password: '',
    email: '', 
    name: '', 
    access_level: 'admin'
  };
  const [createUser, setCreateUser] = useState(defaultUserData);
  
  const changeHandler = (e) => {
    const { id, value } = e.currentTarget;
    setCreateUser({...createUser, [id]: value });
  };

  const submitHandler = (e) => {
    //validate date
    e.preventDefault();
  };

  return (
    <>
    <div className="login-header">
      <h3>No User/Admin Account Exists!</h3>
      <h5><span style={{textAlign: "center"}}>One must be created before proceeding.</span></h5>
      </div>
      <form onSubmit={submitHandler}>
        <label htmlFor="username">Username</label>
        <br />
        <br />
        <input id="username" type="text" onChange={changeHandler} value={createUser.username}/>
        <br />
        <br />
        <label htmlFor="password">Password</label>
        <br />
        <br />
        <input id="password" type="password" onChange={changeHandler}  value={createUser.password}/>
        <br />
        <br />
        <label htmlFor="email">Email</label>
        <br />
        <br />
        <input id="email" type="text" onChange={changeHandler} value={createUser.email} />
        <br />
        <br />
        <label htmlFor="name">Name (First Last)</label>
        <br />
        <br />
        <input id="name" type="text" onChange={changeHandler} value={createUser.name}/>
        <div className="signin-button">
        <button className="create-admin" type="submit">Create</button>
      </div>
      </form>

    </>
  );
}

export default CreateAdmin;