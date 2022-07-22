import "./CreateUser.css";

function CreateUser() {
  const submitHandler = () => {};

  return (
    <section className="create-user-container upload-container-style">
      <h4>Create User</h4>
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
                />

                <input
                  type="radio"
                  id="engineer"
                  name="access_level"
                  value="engineer"
                />

                <input
                  type="radio"
                  id="analyst"
                  name="access_level"
                  value="analyst"
                />
              </div>
            </div>
        </fieldset>

        <div className="create-space">
          <label htmlFor="name">Name ("John Doe")</label>
          <input type="text" id="name" name="name" />

          <label htmlFor="username">Username</label>
          <input type="username" id="username" name="username" />

          <label htmlFor="password">Password</label>
          <input type="text" id="password" name="password" />
          <label htmlFor="email">Email Address</label>
          <input type="text" id="email" name="email" />
        </div>
        <div className="fix-button"><button className="submit-single-asset">Create User</button></div>
      </form>
    </section>
  );
}

export default CreateUser;
