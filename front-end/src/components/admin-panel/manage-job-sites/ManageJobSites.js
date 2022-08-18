//allow admin to view and manage all physical job sites
import { useState, useEffect } from "react";
import './ManageJobSites.css';
//components
import ViewSites from "./ViewSites";
import CreateEditJobSite from "./CreateEditJobSite";

function ManageJobSites({ accountLogged }) {
  const defaultButtonState = {
    view: "button-link",
    create: "button-link"
  };
  const [buttonState, setButtonState] = useState(defaultButtonState);
  const [viewOrCreate, setViewOrCreate] = useState('view');
  const [jobSiteID, setJobSiteID] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    setButtonState({...defaultButtonState, [viewOrCreate]: 'active-button-link'});
    return () => abortController.abort();
  }, [viewOrCreate, setViewOrCreate]);

  const handleClick = (e) => {
    const { id } = e.currentTarget;
    setViewOrCreate(id);
    setButtonState({...defaultButtonState, [id]: 'active-button-link'});
  };    

  return (
    <>
      <div>
        <span style={{color: 'black'}}>[<button className={buttonState.view} id="view" onClick={handleClick}>View Sites</button>]</span>&nbsp;
        <span style={{color: 'black'}}>[<button className={buttonState.create} id="create" onClick={handleClick}>Create Site</button>]</span>
      </div>

      <div className="sub-manage">
      {viewOrCreate === "view" && <ViewSites accountLogged={accountLogged} setViewOrCreate={setViewOrCreate} setJobSiteID={setJobSiteID} />}
      </div>
      {(viewOrCreate === "edit" || viewOrCreate === "create") && <CreateEditJobSite accountLogged={accountLogged} jobSiteID={jobSiteID} setViewOrCreate={setViewOrCreate} viewOrCreate={viewOrCreate} setJobSiteID={setJobSiteID} />}
    </>
  );
}

export default ManageJobSites;
