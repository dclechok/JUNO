import "./BulkUpload.css";
import { useState } from "react";

import Papa from "papaparse";
import { createAsset } from "../../utils/api";
import validateBulkUpload from "../../utils/validateBulkUpload";

import UploadSuccess from "./UploadSuccess";

import uploadTemplate from "../../downloads/upload-template.csv";
/*
  TODO:
  -styling of "upload" button
*/
function BulkUpload({ assetList, setLoadAssets, loadAssets }) {
  const [selectedFile, setSelectedFile] = useState();
  const [loadSuccessLog, setLoadSuccessLog] = useState(false);
  const [stateAssets, setStateAssets] = useState([]);
  let parsedAssets = [];
  let formattedAssets = [];

  const handleChange = (e) => {
    setSelectedFile(e.target.files); //set file to parse from
  };

  const handleSubmit = (e) => {
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
              formattedAssets = validateBulkUpload(assetList, parsedAssets); //HANDLE ALL FORMATTING AND VALIDATION!
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
    }
    setLoadSuccessLog(true);
    setLoadAssets(!loadAssets);
  };

  return (
    <div>
      <section className="container-style-single upload-container">
        <h4>Bulk Upload</h4>
        <h5>
          (.csv file -{" "}
          <a href={uploadTemplate} download="upload-template">
            download
          </a>{" "}
          template)
        </h5>
        <div>
          <input
            type="file"
            name="csv-file"
            accept=".csv"
            onChange={handleChange}
          />
          {!loadSuccessLog && (
            <div>
              <button onClick={handleSubmit}>Upload</button>
            </div>
          )}
        </div>
        {stateAssets.rejected && stateAssets.accepted && (
          <div className="container-style upload-success">
            {loadSuccessLog && (
              <UploadSuccess
                rejectedLog={stateAssets.rejected}
                newAssets={stateAssets.accepted}
              />
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default BulkUpload;
