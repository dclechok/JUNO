import { useEffect, useState } from "react";

import LoaderSpinner from "../../LoaderSpinner";
//utils
import { getJobSite, updateJobSite, createJobSite } from "../../../utils/api";
import generateHistoryKey from "../../../utils/generateHistoryKey";

function CreateEditJobSite({
  accountLogged,
  setViewOrCreate,
  viewOrCreate,
  jobSiteID = "",
  setJobSiteID
}) {
  const newHistoryKey = generateHistoryKey(); //generate unique history key ("action_key")
  const newDate = new Date();
  const [success, setSuccess] = useState(null);
  const [toggleButton, setToggleButton] = useState(true);

  const defaultJobSite = {
    physical_site_name: "",
    physical_site_loc: "",
    created_by: accountLogged.account[0].name,
    site_code: '',
    status: "Active",
    first_octet: '',
    history: [
      //the date of creation can be found by searching history_log via key of historical item
      {
        action_taken: "Create Job Site",
        action_by: accountLogged.account[0].name,
        action_by_id: accountLogged.account[0].user_id,
        action_key: newHistoryKey, //generate unique history key ("action_key")
        action_date: newDate,
        action_comment: "Job Site Creation",
      },
    ],
  };
  const [oldSiteData, setOldSiteData] = useState({});
  const [newSiteData, setNewSiteData] = useState(defaultJobSite);

  useEffect(() => {
    //get old site data if we are editing
    async function grabJobSite() {
      setOldSiteData(...(await getJobSite(jobSiteID)));
    }
    if (jobSiteID) grabJobSite();
  }, [viewOrCreate, setViewOrCreate]);

  const changeHandler = (e) => {
    const { id, value } = e.currentTarget;
    if(viewOrCreate === 'create') setNewSiteData({ ...newSiteData, [id]: value });
    if(viewOrCreate === 'edit') setOldSiteData({...oldSiteData, [id]: value});
  };

  const submitHandler = (e) => {
    e.preventDefault();
    async function makeJobSite() {
      setToggleButton(false);
      if (viewOrCreate === "edit")
        setSuccess(await updateJobSite(oldSiteData, accountLogged));
      else if (viewOrCreate === "create")
        setSuccess(await createJobSite({...defaultJobSite, ...newSiteData}, accountLogged));
    }
    makeJobSite();
  };

  useEffect(() => {
    if(success){
      setToggleButton(true);
    }
  }, [setSuccess, success]);

  return (
    <section className="create-user-container upload-container-style">
      <h4>
        {viewOrCreate.charAt(0).toUpperCase() + viewOrCreate.slice(1)} Job Site
      </h4>
      {(newSiteData && toggleButton) ? (
        <form
          className="form-container create-user-form"
          onSubmit={submitHandler}
        >
          <div className="create-space">
            <label htmlFor="physical_site_name">
              Physical Site Name (ex. "Midland, PA")
            </label>
            <input
              type="text"
              id="physical_site_name"
              name="physical_site_name"
              onChange={changeHandler}
              value={viewOrCreate === 'edit' ? oldSiteData.physical_site_name: newSiteData.physical_site_name}
              placeholder={viewOrCreate === 'edit' ? oldSiteData.physical_site_name : defaultJobSite.physical_site_name}
            />

            <label htmlFor="site_code">Site Code (ex. "MLP/P1")</label>
            <input
              type="text"
              id="site_code"
              name="site_code"
              onChange={changeHandler}
              value={viewOrCreate === 'edit' ? oldSiteData.site_code: newSiteData.site_code}
              placeholder={viewOrCreate === 'edit' ? oldSiteData.site_code : defaultJobSite.site_code}
            />
            <label htmlFor="first_octet">
              Site IP First Octet (ex. "10".x.x.x) (if applicable)
            </label>
            <input
              type="text"
              id="first_octet"
              name="first_octet"
              onChange={changeHandler}
              value={viewOrCreate === 'edit' ? oldSiteData.first_octet: newSiteData.first_octet}
              placeholder={viewOrCreate === 'edit' ? oldSiteData.first_octet : defaultJobSite.first_octet}
            />
          </div>
          <div className="fix-button">
            <button className="submit-single-asset">
              {viewOrCreate.charAt(0).toUpperCase() + viewOrCreate.slice(1)} Job
              Site
            </button>
          </div>
        </form>
      ) : (
        <LoaderSpinner height={45} width={45} message={"User Data"} />
      )}
    </section>
  );
}

export default CreateEditJobSite;
