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

const BASE_URL = "http://localhost:5000/assets";

function SingleAsset({ loadSingleAsset, loadAssets, setLoadAssets }) {
  const [singleAsset, setSingleAsset] = useState("");
  const [singleAssetNav, setSingleAssetNav] = useState("info"); //default to single assets info page
  const { asset_tag } = useParams(); //get asset_tag from url parameters

  useEffect(() => {
    const abortController = new AbortController();

    async function grabSingleAsset() {
      try {
        const response = await fetch(BASE_URL + `/${asset_tag}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const jsonResponse = await response.json(); //json-ify readablestream data
        setSingleAsset([jsonResponse]); //this list will hold the entire list of asset data and will not be modified
      } catch (e) {
        console.log(e, "Failed to fetch all assets.");
      }
    }
    grabSingleAsset();
    return () => abortController.abort;
  }, [loadSingleAsset]);

  function deleteAsset(){
    const abortController = new AbortController();
    async function deleteSingleAsset(){

    try {
      const response = await fetch(BASE_URL + `/${asset_tag}`, {
        method: "DELETE",
      });
      const jsonResponse = await response.json(); //json-ify readablestream data
      if(jsonResponse) setLoadAssets(!loadAssets);
    } catch (e) {
      console.log(e, "Failed to fetch all assets.");
    }
  }
  deleteSingleAsset();
  return () => abortController.abort;
  }

  const handleSubmit = (e) => {
    //sets toggle to render which of the 3 "pages" or edit/delete
    const { id } = e.currentTarget;
    e.preventDefault();
    if(id === "delete") if(window.confirm(`This will permenantly delete the asset ${asset_tag} and all its history. Do you wish to proceed?`)) deleteAsset();
    setSingleAssetNav(e.currentTarget.id); //info, history, move
  };

  return (
    <div className="single-asset-render">
      {singleAsset && Object.keys(singleAsset[0]) !== 0 ? (
        <>
        <h1>Miner Details</h1>
          <header className="single-asset-header container-style">
            <div>
              <p>
                Asset Tag: <b>{singleAsset[0].asset_tag}</b>
              </p>
              <p>
                Status: <b>{singleAsset[0].status}</b>
              </p>
              <p>
                Last Updated: <b>{dateFormatter(singleAsset[0].updated_at)}</b>
              </p>
            </div>
            <div>
              <span style={{color: "black"}}>
              [<button className="button-link" id="info" onClick={handleSubmit}>
                Info
              </button>]
              [<button className="button-link" id="history" onClick={handleSubmit}>
                History
              </button>]
              [<button className="button-link" id="move" onClick={handleSubmit}>
                Move
              </button>]
              [<button className="button-link" id="edit" onClick={handleSubmit}>
                Edit
              </button>]
              [<button className="button-link" id="delete" onClick={handleSubmit}>
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
