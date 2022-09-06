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
    category: "no-selection",
  };

  const [oldSiteData, setOldSiteData] = useState(defaultJobSite);
  const [newSiteData, setNewSiteData] = useState(defaultJobSite);
  const [activeCategory, setActiveCategory] = useState('no-selection');

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
      setActiveCategory('no-selection')
    }
      return () => abortController.abort();
  }, [viewOrCreate, setViewOrCreate]);

  useEffect(() => {
    if(oldSiteData) setActiveCategory(oldSiteData.category.toLowerCase());
  }, [oldSiteData, setOldSiteData]);

  const changeHandler = (e) => {
    const { id, value } = e.currentTarget;
    if(id === "category") setActiveCategory(value);
    viewOrCreate === "create" ? setNewSiteData({ ...newSiteData, [id]: value }) : setOldSiteData({ ...oldSiteData, [id]: value });
  };
  const submitHandler = (e) => {
    e.preventDefault();
    setToggleButton(false); //toggle UI onSubmit
    async function makeJobSite() {
      if (viewOrCreate === "edit") {
        //todo: remove first_octet if not 'live' site?
        if(oldSiteData.category === "no-selection") return window.alert("You must choose a type of job site!");
        if (validateSiteForm(oldSiteData, allJobSites)) {
          const newDate = new Date();
          oldSiteData.category === "production" ? setSuccess(await updateJobSite(
            {
              ...oldSiteData, 
              history: [
                 ...oldSiteData.history,
                 {
                  action_taken: "Edit Job Site",
                  action_date: JSON.stringify(newDate),
                  action_by: accountLogged.account[0].name,
                  action_by_id: accountLogged.account[0].user_id,
                  action_key: generateHistoryKey(),
                  action_comment: "Updated Job Site"
                 }
              ],
              updated_at: newDate
            }, accountLogged)) : setSuccess(await updateJobSite(
                {
                  ...oldSiteData,
                  first_octet: '',
                  history: [
                    ...oldSiteData.history,
                    {
                     action_taken: "Edit Job Site",
                     action_date: JSON.stringify(newDate),
                     action_by: accountLogged.account[0].name,
                     action_by_id: accountLogged.account[0].user_id,
                     action_key: generateHistoryKey(),
                     action_comment: "Updated Job Site"
                    }
                 ],
                updated_at: newDate
                }, accountLogged ));
        }
      } else if (viewOrCreate === "create") {
        if(newSiteData.category === "no-selection") return window.alert("You must choose a type of job site!");
        if (validateSiteForm(newSiteData, allJobSites)) {
          const newHistoryKey = generateHistoryKey(); //generate unique history key ("action_key")
          const newDate = new Date();
          setSuccess(
            await createJobSite(
              {
                ...defaultJobSite,
                 ...newSiteData,
                 history: [
                  //the date of creation can be found by searching history_log via key of historical item
                  {
                    action_taken: "Create Job Site",
                    action_date: JSON.stringify(newDate),
                    action_by: accountLogged.account[0].name,
                    action_by_id: accountLogged.account[0].user_id,
                    action_key: newHistoryKey, //generate unique history key ("action_key")
                    action_comment: "Job Site Creation",
                  }
                ]
              },
              accountLogged
            )
          );
        }
      }
    }
    makeJobSite();
  };

  useEffect(() => {
    const abortController = new AbortController();
    if (success) {
      setToggleButton(true);
      setViewOrCreate("view");
    }
    return () => abortController.abort();
  }, [success]);

  return (
    <section className="create-user-container">
      <h4>
        {viewOrCreate.charAt(0).toUpperCase() + viewOrCreate.slice(1)} Job Site
      </h4>
      {(oldSiteData && toggleButton) || (newSiteData && toggleButton) ? (
        <form
          className="form-container"
          onSubmit={submitHandler}
        >
        <select id="category" onChange={changeHandler} value={activeCategory}>
          <option value="no-selection">Choose Site Type</option>
          <option value="production">Production</option>
          <option value="storage">Storage</option>
          <option value="repair">Repair</option>
        </select>

          <div>
            <label htmlFor="physical_site_name">
              Site Name (ex. "Sandersville, GA")
            </label><br />
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
            /><br />

            <label htmlFor="site_code">Site Code (ex. "GA01")</label><br />
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
            /><br />
            {activeCategory === "production" && (
              <>
                <label htmlFor="first_octet">
                  Site IP First Octet (ex. "10")
                </label><br />
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
                  maxLength="2"
                /><br />
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
