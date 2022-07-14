import "./SingleAsset.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
//components
import SingleAssetInfo from "./SingleAssetInfo.js"; //rendering single assets basic info
import SingleAssetHistory from "./SingleAssetHistory.js"; //rendering single assets historical info
import LoaderSpinner from "../../LoaderSpinner";
//import SingleAssetEdit from ""

//utils
import dateFormatter from "../../../utils/dateFormatter.js";
import { getSingleAsset } from "../../../utils/api";
import { deleteAsset } from '../../../utils/api';

function SingleAsset({ loadSingleAsset, loadAssets, setLoadAssets }) {
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
  
  const { asset_tag } = useParams(); //get asset_tag from url parameters

  useEffect(() => {
    const abortController = new AbortController();
    async function grabSingleAsset() {
        setSingleAsset([await getSingleAsset(asset_tag)]); //this list will hold the entire list of asset data and will not be modified
    }
    grabSingleAsset();
    setButtonState({...defaultButtonState, info: "active-button-link"}); //default to our info component, make button active
    return () => abortController.abort;
  }, [loadSingleAsset]);

  function deleteSingleAsset(){
    const abortController = new AbortController();
    deleteAsset(asset_tag);
    return () => abortController.abort;
  }

  const handleSubmit = (e) => {
    //sets toggle to render which of the 3 "pages" or edit/delete
    const { id } = e.currentTarget;
    e.preventDefault();
    if(id === "delete") if(window.confirm(`This will permenantly delete the asset ${asset_tag} and all its history. Do you wish to proceed?`)) deleteSingleAsset();
    setButtonState({...defaultButtonState, [id]: "active-button-link"});
    setSingleAssetNav(e.currentTarget.id); //info, history, move, edit
  };

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
              <span style={{color: "black"}}>
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
