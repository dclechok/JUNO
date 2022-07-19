import { useState } from "react";

//utils
import generateHistoryKey from "../../utils/generateHistoryKey";
import { createJobSite } from "../../utils/api";

function CreateSite({ accountLogged }) {
  const action_date = new Date();
  const newHistoryKey = generateHistoryKey(); //generate unique history key ("action_key")

  const defaultJobSite = {
    physical_site_name: "",
    physical_site_loc: "",
    created_by: accountLogged.account[0].name,
    history: {
      action_date: action_date,
      action_taken: "Create Job Site",
      action_by: accountLogged.account[0].name,
      action_by_id: accountLogged.account[0].user_id,
      action_comment: "Initial Upload",
      action_key: newHistoryKey //generate unique history key ("action_key")
    },
  };
  const [newJobSite, setNewJobSite] = useState(defaultJobSite);

  const submitHandler = (e) => {
    e.preventDefault();
    async function createNewJobSite(){
      createJobSite(newJobSite);
    }
    createNewJobSite();
  };

  const changeHandler = (e) => {
    const { id, value } = e.currentTarget;
    setNewJobSite({ ...newJobSite, [id]: value });
  };

  return (
    <section className="upload-container-style">
      <h4>Create Job Site</h4>
      <>
        <form className="form-container" onSubmit={submitHandler}>
          <div className="create-space">
            <label htmlFor="physical_site_name">
              Job Site (ex. "Midland, PA")
            </label>
            <input
              id="physical_site_name"
              type="text"
              value={newJobSite.physical_site_name}
              onChange={changeHandler}
            />
            <br />
          </div>
          <div className="create-space">
            <label htmlFor="physical_site_loc">Site ID (ex. "MLP-PA")</label>
            <input
              id="physical_site_loc"
              type="text"
              value={newJobSite.physical_site_loc}
              onChange={changeHandler}
            />
            <br />
          </div>
          <div className="fix-button">
            <button className="submit-single-asset" type="submit">
              Upload Job Site
            </button>
          </div>
        </form>
      </>
    </section>
  );
}

export default CreateSite;
