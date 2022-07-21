//allow admin to view and manage all physical job sites
import { useState, useEffect } from "react";

//components
import ViewSites from "./ViewSites";
import CreateSite from './CreateSite';

function ManageJobSites({ accountLogged }) {
  const defaultButtonState = {
    view: "button-link",
    create: "button-link"
  };
  const [buttonState, setButtonState] = useState(defaultButtonState);
  const [viewOrCreate, setViewOrCreate] = useState('view');

  useEffect(() => {
    setButtonState({...defaultButtonState, view: 'active-button-link'});
  }, [viewOrCreate, setViewOrCreate]);

  const handleClick = (e) => {
    const { id } = e.currentTarget;
    setViewOrCreate(id);
    setButtonState({...defaultButtonState, [id]: 'active-button-link'});
  };    

  return (
    <>
      <div className="sub-manage">
        <span style={{color: 'black'}}>[<button className={buttonState.view} id="view" onClick={handleClick}>View Sites</button>]</span>&nbsp;
        <span style={{color: 'black'}}>[<button className={buttonState.create} id="create" onClick={handleClick}>Create Site</button>]</span>
      </div>
      {viewOrCreate === "view" && <ViewSites accountLogged={accountLogged} />}
      {viewOrCreate === "create" && <CreateSite accountLogged={accountLogged} setViewOrCreate={setViewOrCreate} />}
    </>
  );
}

export default ManageJobSites;
