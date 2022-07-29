//allow admin to view and manage all physical job sites
import { useState, useEffect } from "react";

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
    setButtonState({...defaultButtonState, [viewOrCreate]: 'active-button-link'});
  }, [viewOrCreate, setViewOrCreate]);

  const handleClick = (e) => {
    const { id } = e.currentTarget;
    setViewOrCreate(id);
    setButtonState({...defaultButtonState, [id]: 'active-button-link'});
  };    
  console.log(viewOrCreate);
  return (
    <>
      <div className="sub-manage">
        <span style={{color: 'black'}}>[<button className={buttonState.view} id="view" onClick={handleClick}>View Sites</button>]</span>&nbsp;
        <span style={{color: 'black'}}>[<button className={buttonState.create} id="create" onClick={handleClick}>Create Site</button>]</span>
      </div>
      {viewOrCreate === "view" && <ViewSites accountLogged={accountLogged} setViewOrCreate={setViewOrCreate} setJobSiteID={setJobSiteID} />}
      {(viewOrCreate === "edit" || viewOrCreate === "create") && <CreateEditJobSite accountLogged={accountLogged} jobSiteID={jobSiteID} setViewOrCreate={setViewOrCreate} viewOrCreate={viewOrCreate} setJobSiteID={setJobSiteID} />}
    </>
  );
}

export default ManageJobSites;
