import "./SingleAsset.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
//components
import SingleAssetInfo from "./SingleAssetInfo.js"; //rendering single assets basic info
import SingleAssetHistory from "./SingleAssetHistory.js"; //rendering single assets historical info
import SingleAssetEdit from "./SingleAssetEdit"; //component to edit individual asset's details
import SingleAssetMove from "./SingleAssetMove"; //component to move an individual asset

import LoaderSpinner from "../../LoaderSpinner";

//utils
import dateFormatter from "../../../utils/dateFormatter.js";
import { getSingleAsset } from "../../../utils/api";
import { deleteAsset } from '../../../utils/api';

function SingleAsset({ loadSingleAsset, accountLogged }) {
  const [singleAsset, setSingleAsset] = useState("");
  const [singleAssetNav, setSingleAssetNav] = useState("info"); //default to single assets info page
  const defaultButtonState = {
    info: "button-link",
    history: "button-link",
    move: "button-link",
    edit: "button-link",
    delete: "button-link"
  };
  const [buttonState, setButtonState] = useState(defaultButtonState); //"button-link" (inactive) or "active-button-link" (active) classes
  const { asset_id } = useParams(); //get asset_tag from url parameters

  useEffect(() => {
    const abortController = new AbortController();
    async function grabSingleAsset() {
      setSingleAsset([await getSingleAsset(asset_id)]); //this list will hold the entire list of asset data and will not be modified
    }
    grabSingleAsset();
    setButtonState({ ...defaultButtonState, info: "active-button-link" }); //default to our info component, make button active
    return () => abortController.abort;
  }, [loadSingleAsset]);

  function deleteSingleAsset() {
    const abortController = new AbortController();
    deleteAsset(asset_id);
    return () => abortController.abort;
  }

  const handleSubmit = (e) => {
    //sets toggle to render which of the 3 "pages" or edit/delete
    const { id } = e.currentTarget;
    e.preventDefault();
    if (id === "delete") window.confirm(`This will permenantly deactivate the asset ${asset_id} and all its history. Do you wish to proceed?`) ? deleteSingleAsset() : console.log('nope');
    if (id === "edit" && accountLogged.account[0].access_level === 'analyst') window.alert("You must be an Administrator or Engineer to edit this component.");
    setButtonState({ ...defaultButtonState, [id]: "active-button-link" });
    setSingleAssetNav(e.currentTarget.id); //info, history, move, edit
  };
  console.log(singleAsset)
  return (
    <div className="single-asset-render">
      {singleAsset && Object.keys(singleAsset[0]) !== 0 ? (
        <>
          <h1>Miner Details</h1>
          <header className="single-asset-header container-style">
            <div>
              <p>
                <b>Asset Tag</b>: {singleAsset[0].asset_tag}
              </p>
              <p>
                <b>Status</b>: {singleAsset[0].status}
              </p>
              <p>
                <b>Last Updated</b>: {dateFormatter(singleAsset[0].updated_at)}
              </p>
            </div>
            <div>
              <span style={{ color: "black" }}>
                [<button className={buttonState.info} id="info" onClick={handleSubmit}>
                  Info
                </button>]
                [<button className={buttonState.history} id="history" onClick={handleSubmit}>
                  History
                </button>]
                [<button className={buttonState.move} id="move" onClick={handleSubmit}>
                  Move
                </button>]
                [<button className={buttonState.edit} id="edit" onClick={handleSubmit}>
                  Edit
                </button>]
                [<button className={buttonState.delete} id="delete" onClick={handleSubmit}>
                  Delete
                </button>]
              </span>
            </div>
          </header>
          <section className="container-style single-asset-body">
            {singleAssetNav === "info" && (
              <SingleAssetInfo singleAsset={singleAsset} />
            )}
            {singleAssetNav === "history" && (
              <SingleAssetHistory singleAsset={singleAsset} />
            )}
            {singleAssetNav === "edit" && (
              <SingleAssetEdit singleAsset={singleAsset} accountLogged={accountLogged} />
            )}
            {singleAssetNav === "move" && (
              <SingleAssetMove singleAsset={singleAsset} accountLogged={accountLogged} />
            )}
          </section>
        </>
      ) : (<div className="loader-spinner">
        <LoaderSpinner height={45} width={45} message={"Asset"} />
      </div>
      )}
    </div>
  );
}

export default SingleAsset;
