import { useEffect, useState } from "react";

import LoaderSpinner from "../../LoaderSpinner";
//utils
import { getJobSite, updateJobSite } from "../../../utils/api";

function EditJobSite({ jobSiteID, accountLogged, setViewOrCreate }) {
  const [oldSiteData, setOldSiteData] = useState(null);
  const [newSiteData, setNewSiteData] = useState(null);
  const [editJobSiteSuccess, setEditJobSiteSuccess] = useState(null);
  useEffect(() => {
    async function grabJobSite() {
      setOldSiteData(...await getJobSite(jobSiteID));
      if(oldSiteData) setNewSiteData(oldSiteData);
    }
    grabJobSite();
  }, []);

  const changeHandler = (e) => {
    const { id, value } = e.currentTarget;
    setNewSiteData({ ...newSiteData, [id]: value });
  };
  const submitHandler = (e) => {
    e.preventDefault();
    async function makeJobSiteUpdate(){
        setEditJobSiteSuccess(await updateJobSite(newSiteData, accountLogged));
    }
    makeJobSiteUpdate();
  };

  useEffect(() => {
    if(oldSiteData) setNewSiteData(oldSiteData);
  }, [oldSiteData]);

  useEffect(() => {
    if(editJobSiteSuccess) setViewOrCreate('view');
  }, [editJobSiteSuccess]);

  return (
    <section className="create-user-container upload-container-style">
      <h4>Edit User</h4>
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
              placeholder={oldSiteData.physical_site_name}
            />

            <label htmlFor="site_code">
              Site Code (ex. "MLP/P1")
            </label>
            <input
              type="text"
              id="site_code"
              name="site_code"
              onChange={changeHandler}
              placeholder={oldSiteData.site_code}
            />
                        <label htmlFor="first_octet">
            Site IP First Octet (ex. "10".x.x.x)
            </label>
            <input
              type="text"
              id="first_octet"
              name="first_octet"
              onChange={changeHandler}
              placeholder={oldSiteData.first_octet}
            />
          </div>
          <div className="fix-button">
            <button className="submit-single-asset">Update Job Site</button>
          </div>
        </form>
      ) : (
        <LoaderSpinner height={45} width={45} message={"User Data"} />
      )}
    </section>
  );
}

export default EditJobSite;
