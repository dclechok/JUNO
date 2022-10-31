import "./UploadContainersStyle.css";
import { useState, useEffect } from "react";

import Papa, { parse } from "papaparse";
import { createAsset, getJobSites } from "../../utils/api";

//components
import UploadSuccess from "./UploadSuccess";
import LoadingBar from "./LoadingBar";

//utils
import uploadTemplate from "../../downloads/upload-template.csv";
import LoaderSpinner from "../LoaderSpinner";
import validateBulkUpload from "../../utils/validation/validateBulkUpload";
import { getAllAssets } from '../../utils/api';

function BulkUpload({ accountLogged }) {
  const [selectedFile, setSelectedFile] = useState(); // csv file to parse
  const [loadSuccessLog, setLoadSuccessLog] = useState(false);
  const [toggleLoader, setToggleLoader] = useState(false) //toggle loading spinner when loading uploads
  const [jobSites, setJobSites] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [assetList, setAssetList] = useState(null);
  const [toggleProgress, setToggleProgress] = useState(0);
  const validatedAssetList = { accepted: [], rejected: [] };
  const [stateAssets, setStateAssets] = useState();

  let newAssetValidated;
  let parsedAssets = [];
  let formattedAssets = [];
 

  useEffect(() => { //get most updated asset list 
    async function loadAssets() {
      setAssetList(await getAllAssets());
    }
    loadAssets();
  }, []);

  useEffect(() => { //load job sites
    const newAbortController = new AbortController();
    async function getAllSites() {
      setJobSites(await getJobSites());
    }
    getAllSites();
    return newAbortController.abort();
  }, []); //populate jobsite list

  const handleChange = (e) => {
    setSelectedFile(e.target.files); //set file to parse from
  };

  function validateHeaders(parsedAssets) {
    //check for 5 headers: asset tag, status, serial_number, make, model, hr
    if (
      parsedAssets[0][0].toLowerCase() === "location" &&
      parsedAssets[0][1].toLowerCase() === "serial #" &&
      parsedAssets[0][2].toLowerCase() === "asset #" &&
      parsedAssets[0][3].toLowerCase() === "make" &&
      parsedAssets[0][4].toLowerCase() === "model" &&
      parsedAssets[0][5].toLowerCase() === "hashrate"
    ) return true;
  }

  const parseAssets = () => {
    Papa.parse(selectedFile[0], {
      complete: function (results) {
        parsedAssets = results.data.splice(0, results.data.length - 1)
        //validate for headers, if valid we move to validate each row
        if (validateHeaders(parsedAssets)) {
          if (parsedAssets && parsedAssets.length !== 0) {
            //initialize progress bar

            //validate each row, build two arrays: accepted / rejected
            parsedAssets.forEach(asset => {
              newAssetValidated = validateBulkUpload(asset, parsedAssets, assetList, accountLogged, jobSites);
                !newAssetValidated.reject_err ? validatedAssetList.accepted.push(newAssetValidated) : validatedAssetList.rejected.push(newAssetValidated);
                setStateAssets({ ...stateAssets, newAssetValidated });
              });
            }
          return newAssetValidated;
        }
      }
    })
  };
  console.log(stateAssets)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      //make sure the upload file type is correct
      if (selectedFile[0].type !== "text/csv")
        window.alert(
          `"${selectedFile[0].type}" is not a proper file type. .CSV required!`
        );
      else{
        setToggleLoader(true);
        formattedAssets = parseAssets();
        console.log(formattedAssets);
            //   async function createNewAsset(newAssetList) {
            //     if (newAssetList.length !== 0) {
            //       try {
            //         setUploadSuccess(await createAsset(newAssetList)); //create log of fails/successes
            //       } catch (e) {
            //         console.log(e, "Failed to create new assets.");
            //       }
            //     }
            //   }
            //   if (
            //     formattedAssets.accepted &&
            //     formattedAssets.accepted.length > 0
            //   ) {
            //     createNewAsset(formattedAssets.accepted);
            //   } else setUploadSuccess('No assets accepted!');
            // } else return 'Headers are invalid!';
      }
    }
  };

  // useEffect(() => {
  //   if(stateAssets) console.log(stateAssets.length);
  // }, [stateAssets, setStateAssets]);

  useEffect(() => {
    if (uploadSuccess) {
      setToggleLoader(false);
    }
  }, [uploadSuccess, setUploadSuccess]);

  return (
    <div>
      {jobSites && assetList ?
        <form className="form-container">
                      {toggleLoader ? 
                      <div>
                        <h4>{validatedAssetList.accepted + validatedAssetList.rejected}</h4>
                      <LoadingBar />
                      </div> :
            <>
              <h5>
                (.csv file -{" "}
                <a href={uploadTemplate} download="upload-template">
                  download
                </a>{" "}
                template)
              </h5>
              <div>
                <input className="csv-input"
                  type="file"
                  name="csv-file"
                  accept=".csv"
                  onChange={handleChange}
                />

                <div>
                  <button onClick={handleSubmit}>
                    Upload
                  </button>
                </div>
              </div>
            </>}
          <div>
            {/* {loadSuccessLog &&
              <UploadSuccess
                rejectedLog={stateAssets.rejected}
                acceptedLog={stateAssets.accepted}
              />
            } */}
          </div>


        </form> : <LoaderSpinner height={45} width={45} message={"Data..."} />}
    </div>
  );
}

export default BulkUpload;
