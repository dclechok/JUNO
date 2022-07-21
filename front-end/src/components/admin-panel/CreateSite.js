import { useEffect, useState } from "react";

//utils
import generateHistoryKey from "../../utils/generateHistoryKey";
import { createJobSite } from "../../utils/api";
import LoaderSpinner from "../LoaderSpinner";

function CreateSite({ accountLogged, setViewOrCreate }) {
  const newHistoryKey = generateHistoryKey(); //generate unique history key ("action_key")
  const newDate = new Date();
  const defaultJobSite = {
    physical_site_name: "",
    physical_site_loc: "",
    created_by: accountLogged.account[0].name,
    status: "Active",
    history: [ //the date of creation can be found by searching history_log via key of historical item
      {
        action_taken: "Create Job Site",
        action_by: accountLogged.account[0].name,
        action_by_id: accountLogged.account[0].user_id,
        action_key: newHistoryKey, //generate unique history key ("action_key")
        action_date: newDate,
        action_comment: "Job Site Creation"
      }
    ]
  };

  const [newJobSite, setNewJobSite] = useState(defaultJobSite);
  const [successJobSiteCreate, setSuccessJobSiteCreate] = useState(null);
  const [createButtonDisabled, setCreateButtonDisabled] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    async function createNewJobSite(){
      setSuccessJobSiteCreate(await createJobSite(newJobSite));
      if(setSuccessJobSiteCreate) setViewOrCreate("view");
    }
    createNewJobSite();
    setCreateButtonDisabled(true);
  };

  const changeHandler = (e) => {
    const { id, value } = e.currentTarget;
    setNewJobSite({ ...newJobSite, [id]: value });
  };

  useEffect(() => {
    if(successJobSiteCreate){
      setViewOrCreate("view");
    }
    }, [successJobSiteCreate, setSuccessJobSiteCreate]);

  return (
    <section className="upload-container-style">
      <h4>Create Job Site</h4>
      <>
      {!createButtonDisabled ? 
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
            <button className="submit-single-asset" type="submit" disabled={createButtonDisabled}>
              Upload Job Site
            </button>
          </div>
          
        </form>
        : <LoaderSpinner width={45} height={45} message="Job Sites" />}
      </>
    </section>
  );
}

export default CreateSite;
