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

  const [oldSiteData, setOldSiteData] = useState({});
  const [newSiteData, setNewSiteData] = useState({});
  const [success, setSuccess] = useState(null);

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

  useEffect(() => {
    //get old site data if we are editing
    async function grabJobSite() {
      setOldSiteData(...(await getJobSite(jobSiteID)));
      if (oldSiteData) setNewSiteData(oldSiteData); //editing old data
    }
    if (jobSiteID) grabJobSite();
    else setNewSiteData(defaultJobSite);
    }, [viewOrCreate, setViewOrCreate]);

  const changeHandler = (e) => {
    const { id, value } = e.currentTarget;
    setNewSiteData({ ...newSiteData, [id]: value });
  };
  const submitHandler = (e) => {
    e.preventDefault();
    async function makeJobSite() {
      if (viewOrCreate === "edit")
        setSuccess(await updateJobSite(newSiteData, accountLogged));
      else if (viewOrCreate === "create")
        setSuccess(await createJobSite(newSiteData, accountLogged));
    }
    makeJobSite();
  };

  console.log(jobSiteID, newSiteData)

  useEffect(() => {
    if(viewOrCreate === "create") setJobSiteID('');
  }, [viewOrCreate, setViewOrCreate]);

  useEffect(() => {
    if (success) setViewOrCreate("view");
  }, [success]);

  return (
    <section className="create-user-container upload-container-style">
      <h4>
        {viewOrCreate.charAt(0).toUpperCase() + viewOrCreate.slice(1)} Job Site
      </h4>
      {newSiteData ? (
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
              placeholder={viewOrCreate === 'edit' ? oldSiteData.physical_site_name : defaultJobSite.physical_site_name}
            />

            <label htmlFor="site_code">Site Code (ex. "MLP/P1")</label>
            <input
              type="text"
              id="site_code"
              name="site_code"
              onChange={changeHandler}
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
