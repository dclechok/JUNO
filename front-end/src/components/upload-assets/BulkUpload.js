import "./UploadContainersStyle.css";
import { useState, useEffect } from "react";

import Papa from "papaparse";
import { createAsset, getJobSites } from "../../utils/api";
import validateBulkUpload from "../../utils/validation/validateBulkUpload";

import UploadSuccess from "./UploadSuccess";

import uploadTemplate from "../../downloads/upload-template.csv";
import LoaderSpinner from "../LoaderSpinner";

function BulkUpload({ assetList, setLoadAssets, loadAssets, accountLogged }) {
  const [selectedFile, setSelectedFile] = useState();
  const [loadSuccessLog, setLoadSuccessLog] = useState(false);
  const [stateAssets, setStateAssets] = useState([]);
  const [jobSites, setJobSites] = useState([]);

  let parsedAssets = [];
  let formattedAssets = [];

  useEffect(() => {
    const newAbortController = new AbortController();
    async function getAllSites(){
      setJobSites(await getJobSites());
    }
    getAllSites();
    return newAbortController.abort();
  }, []); //populate jobsite list

  const handleChange = (e) => {
    setSelectedFile(e.target.files); //set file to parse from
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      if (selectedFile[0].type !== "text/csv")
        window.alert(
          `"${selectedFile[0].type}" is not a proper file type. .CSV required!`
        );
      else if (selectedFile) {
        Papa.parse(selectedFile[0], {
          complete: function (results) {
            parsedAssets = results.data.splice(0, results.data.length - 1);
            // setParsedAssets(results.data.splice(0, results.data.length - 1)); //last entry is blank/invalid
            if (parsedAssets && parsedAssets.length !== 0)
              formattedAssets = validateBulkUpload(assetList, parsedAssets, accountLogged, jobSites); //HANDLE ALL FORMATTING AND VALIDATION!
            setStateAssets(formattedAssets);
            async function createNewAsset(newAssetList) {
              if (newAssetList.length !== 0) {
                try {
                  await createAsset(newAssetList); //create log of fails/successes
                } catch (e) {
                  console.log(e, "Failed to create new assets.");
                }
              }
            }
            if (
              formattedAssets.accepted &&
              formattedAssets.accepted.length > 0
            ) {
              createNewAsset(formattedAssets.accepted);
              setLoadAssets(!loadAssets);
            }
          },
        });
      }
      setLoadSuccessLog(true);
      setLoadAssets(!loadAssets);
    }
  };

  return (
    <div>
      {jobSites ? 
      <>
      <section className="upload-container-style" >
        <h4>Bulk Upload</h4>
        <form className="form-container-bulk">
          {!loadSuccessLog && 
          <>
        <h5>
          (.csv file -{" "}
          <a href={uploadTemplate} download="upload-template">
            download
          </a>{" "}
          template)
        </h5></>}
        <div>
          {!loadSuccessLog && (
            <>
              <input className="csv-input"
                type="file"
                name="csv-file"
                accept=".csv"
                onChange={handleChange}
              />

              <div>
                <button className="submit-single-asset bulk-upload-button" onClick={handleSubmit}>
                  Upload
                </button>
              </div>
            </>
          )}
        </div>
        {stateAssets.rejected && stateAssets.accepted && (
          <div>
            {loadSuccessLog && (
              <UploadSuccess
                rejectedLog={stateAssets.rejected}
                newAssets={stateAssets.accepted}
              />
            )}
          </div>
        )}
        </form>
      </section>
      </>: <LoaderSpinner height={45} width={45} message={"Job Sites"} />}
    </div>
  );
}

export default BulkUpload;
