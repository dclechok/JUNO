import { useEffect, useState } from "react";

import LoaderSpinner from "../../LoaderSpinner";
//utils
import {
  getJobSite,
  updateJobSite,
  createJobSite,
  getJobSites,
} from "../../../utils/api";
import generateHistoryKey from "../../../utils/generateHistoryKey";
import validateSiteForm from "../../../utils/validation/validateSiteForm";

function CreateEditJobSite({
  accountLogged,
  setViewOrCreate,
  viewOrCreate,
  jobSiteID = "",
}) {
  const newHistoryKey = generateHistoryKey(); //generate unique history key ("action_key")
  const newDate = new Date();
  const [success, setSuccess] = useState(null);
  const [toggleButton, setToggleButton] = useState(true);
  const [allJobSites, setAllJobSites] = useState(null); //when creating, store list of job sites here to validate new job site data
  const defaultJobSite = {
    physical_site_name: "",
    physical_site_loc: "",
    created_by: accountLogged.account[0].name,
    site_code: "",
    status: "Active",
    first_octet: "",
    category: "",
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

  const [oldSiteData, setOldSiteData] = useState(defaultJobSite);
  const [newSiteData, setNewSiteData] = useState(defaultJobSite);
  const defaultButtonChecked = {
    "Live": false,
    "Storage": false,
    "Repair": false,
  };
  const [radioBtnChecked, setRadioBtnChecked] = useState(defaultButtonChecked);

  useEffect(() => {
    const abortController = new AbortController();
    async function getAllJobSites() {
      setAllJobSites(await getJobSites());
    }
    getAllJobSites();
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    //get old site data if we are editing
    const abortController = new AbortController();
    async function grabJobSite() {
      setOldSiteData(...(await getJobSite(jobSiteID)));
    }
    if (jobSiteID && viewOrCreate === "edit") {
      grabJobSite();
      setNewSiteData(oldSiteData)
    }
    else if (viewOrCreate === "create") {
      setOldSiteData(null);
      setNewSiteData(defaultJobSite);
      setRadioBtnChecked(defaultButtonChecked);
    }
      return () => abortController.abort();
  }, [viewOrCreate, setViewOrCreate]);

  const changeHandler = (e) => {
    const { type, id, value } = e.currentTarget;
    if (viewOrCreate === "create") {
      if (type === "radio") {
        setRadioBtnChecked({ ...defaultButtonChecked, [value]: true });
        setNewSiteData({ ...newSiteData, category: value });
      } else setNewSiteData({ ...newSiteData, [id]: value });
    }
    if (viewOrCreate === "edit") {
      if (type === "radio") {
       setOldSiteData({ ...oldSiteData, category: value });
      } else setOldSiteData({ ...oldSiteData, [id]: value });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    async function makeJobSite() {
      if (viewOrCreate === "edit") {
        //todo: remove first_octet if not 'live' site?
        if (validateSiteForm(oldSiteData, allJobSites)) {
          setToggleButton(false);
          radioBtnChecked["Live"] ? setSuccess(await updateJobSite(oldSiteData, accountLogged)) : setSuccess(await updateJobSite({...oldSiteData, first_octet: '' }, accountLogged ));
        }
      } else if (viewOrCreate === "create") {
        if (validateSiteForm(newSiteData, allJobSites)) {
          setToggleButton(false);
          setSuccess(
            await createJobSite(
              { ...defaultJobSite, ...newSiteData },
              accountLogged
            )
          );
        }
      }
    }
    makeJobSite();
  };
  console.log(oldSiteData)
  useEffect(() => {
    const abortController = new AbortController();
    if (success) {
      setToggleButton(true);
      setViewOrCreate("view");
    }
    return () => abortController.abort();
  }, [setSuccess, success]);

  useEffect(() => {
    if(oldSiteData){
      setRadioBtnChecked({ ...defaultButtonChecked, [oldSiteData.category]: true });
    }
  }, [oldSiteData]);

  useEffect(() => {
    setNewSiteData({ ...newSiteData, first_octet: '' });
  }, [setRadioBtnChecked]);

  return (
    <section className="create-user-container upload-container-style">
      <h4>
        {viewOrCreate.charAt(0).toUpperCase() + viewOrCreate.slice(1)} Job Site
      </h4>
      {oldSiteData || newSiteData && toggleButton ? (
        <form
          className="form-container create-user-form"
          onSubmit={submitHandler}
        >
          <fieldset>
            <legend>Job Site Category</legend>
            <div className="radio-buttons-container">
              <div className="flex-header">
                <label htmlFor="live">Live Site</label>
                <label htmlFor="storage">Storage</label>
                <label htmlFor="repair">Repair</label>
              </div>
              <div className="flex-buttons">
                <input
                  type="radio"
                  id="live"
                  name="category"
                  value="Live"
                  onChange={changeHandler}
                  checked={radioBtnChecked["Live"]}
                />

                <input
                  type="radio"
                  id="storage"
                  name="category"
                  value="Storage"
                  onChange={changeHandler}
                  checked={radioBtnChecked["Storage"]}
                />

                <input
                  type="radio"
                  id="repair"
                  name="category"
                  value="Repair"
                  onChange={changeHandler}
                  checked={radioBtnChecked["Repair"]}
                />
              </div>
            </div>
          </fieldset>

          <div className="create-space">
            <label htmlFor="physical_site_name">
              Physical Site Name (ex. "Sandersville, GA")
            </label>
            <input
              type="text"
              id="physical_site_name"
              name="physical_site_name"
              onChange={changeHandler}
              value={
                viewOrCreate === "edit"
                  ? oldSiteData.physical_site_name
                  : newSiteData.physical_site_name
                  || ''
              }
              placeholder={
                viewOrCreate === "edit"
                  ? oldSiteData.physical_site_name
                  : defaultJobSite.physical_site_name
              }
            />

            <label htmlFor="site_code">Site Code (ex. "GA01")</label>
            <input
              type="text"
              id="site_code"
              name="site_code"
              onChange={changeHandler}
              value={
                viewOrCreate === "edit"
                  ? oldSiteData.site_code
                  : newSiteData.site_code
                  || ''
              }
              placeholder={
                viewOrCreate === "edit"
                  ? oldSiteData.site_code
                  : defaultJobSite.site_code
              }
            />
            {radioBtnChecked && radioBtnChecked["Live"] && (oldSiteData || newSiteData) && (
              <>
                <label htmlFor="first_octet">
                  Site IP First Octet (ex. "10")
                </label>
                <input
                  type="text"
                  id="first_octet"
                  name="first_octet"
                  onChange={changeHandler}
                  value={
                    viewOrCreate === "edit"
                      ? oldSiteData.first_octet
                      : newSiteData.first_octet
                      || ''
                  }
                  placeholder={
                    viewOrCreate === "edit"
                      ? oldSiteData.first_octet
                      : defaultJobSite.first_octet
                  }
                />
              </>
            )}
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
