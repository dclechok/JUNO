import "./UploadContainersStyle.css";
import { useEffect, useState } from "react";
import generateHistoryKey from "../../utils/generateHistoryKey";

//components
import UploadSuccess from "./UploadSuccess.js";
import LoaderSpinner from "../LoaderSpinner.js";

//utils
import { createAsset } from "../../utils/api.js";
import { getJobSites } from "../../utils/api.js";
import validateSingleUpload from "../../utils/validation/validateSingleUpload";

function SingleUpload({ assetList, setLoadAssets, loadAssets, accountLogged }) {
  const [jobSites, setJobSites] = useState([]);
  const [locationSelect, setLocationSelect] = useState("All Locations");
  const [logItem, setLogItem] = useState();
  const [targetSite, setTargetSite] = useState();
  const [successfulUpload, setSuccessfulUpload] = useState(false);
  const [assetFields, setAssetFields] = useState({
    asset_tag: "",
    location: "",
    serial_number: "",
    make: "",
    model: "",
    hr: "",
  });

  let acceptOrReject = [];
  const selectHandler = (e) => {
    //create controlled input
    e.preventDefault();
    setLocationSelect(e.currentTarget.value);
   setAssetFields({
      ...assetFields,
      location: { site: e.currentTarget.value, site_loc: "" },
    });
  };

  useEffect(() => {
    setTargetSite(jobSites.find(js => {
      if(js.physical_site_name === locationSelect) return js.category;
    }));
  }, [locationSelect, setLocationSelect])

  const setStatus = () => {
    if(targetSite && targetSite.category === "Live") return "Needs Verified";
    if(targetSite && targetSite.category === "Repair") return "Repair";
    if(targetSite && targetSite.category === "Storage") return "Storage";
  };

  const changeHandler = (e) => {
    //create controlled input
    e.preventDefault();
    const { value, id } = e.currentTarget;
    setAssetFields({ ...assetFields, [id]: value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    acceptOrReject = validateSingleUpload(assetFields, assetList);
    // make post request
    if (acceptOrReject !== "fields not validated") {
      setLogItem(acceptOrReject);
      if (acceptOrReject.rejected.length === 0) {
        const action_date = new Date();
        const newHistoryKey = generateHistoryKey(); //generate unique history key ("action_key")
        async function postSingleAsset() {
          setSuccessfulUpload(await createAsset(
            {
              ...assetFields,
              status: setStatus(),
              history: [
                {
                  action_taken: "Single Upload",
                  action_date: action_date,
                  action_by: accountLogged.account[0].name,
                  action_by_id: accountLogged.account[0].user_id,
                  action_key: newHistoryKey,
                  action_comment: "Initial Upload"
                },
              ],
            },
          ));
        }
        postSingleAsset();
      }
      setLoadAssets(!loadAssets);
    }
  };

  useEffect(() => {
    //populate job sites in location field
    const abortController = new AbortController();
    async function populateSites() {
      setJobSites(await getJobSites());
    }
    populateSites();
    return () => abortController.abort();
  }, [setAssetFields]);

  return (
    <section className="upload-container-style">
      <h4>Single Upload</h4>
      {jobSites && jobSites.length !== 0 ? (
        <>
          {!successfulUpload && !logItem && (
            <form className="form-container" onSubmit={submitHandler}>
              <div>
                <label htmlFor="location">Location</label>
                <br />
                <select
                  id="location"
                  type="text"
                  value={locationSelect}
                  onChange={selectHandler}
                >
                  <option default> -- select an option --</option>
                  {jobSites &&
                    jobSites.length !== 0 &&
                    jobSites.map((site, key) => {
                      if (site.status === "Active")
                        return (
                          <option
                            id={site.physical_site_name}
                            key={key}
                            value={site.physical_site_name}
                          >
                            {site.physical_site_name}
                          </option>
                        );
                    })}
                </select>
                <br />
              </div>
              <div>
              <label htmlFor="asset_tag">IP ("xx.xx.xx.xx")</label>
                <input
                  id="ip"
                  type="text"
                  value={assetFields.location.site_loc}
                  onChange={changeHandler}
                />
                <br />
                </div>
              <div>
                <label htmlFor="asset_tag">Asset Tag</label>
                <input
                  id="asset_tag"
                  type="text"
                  value={assetFields.asset_tag}
                  onChange={changeHandler}
                />
                <br />
              </div>
              <div>
                <label htmlFor="serial-number">Serial #</label>
                <input
                  id="serial_number"
                  type="text"
                  value={assetFields.serial_number}
                  onChange={changeHandler}
                />
                <br />
              </div>
              <div>
                <label htmlFor="make">Make</label>
                <input
                  id="make"
                  type="text"
                  value={assetFields.make}
                  onChange={changeHandler}
                />
                <br />
              </div>
              <div>
                <label htmlFor="model">Model</label>
                <input
                  id="model"
                  type="text"
                  value={assetFields.model}
                  onChange={changeHandler}
                />
                <br />
              </div>
              <div>
                <label htmlFor="hr">Hashrate</label>
                <input
                  id="hr"
                  type="text"
                  value={assetFields.hr}
                  onChange={changeHandler}
                />
                <br />
              </div>
              <div className="fix-button">
                <button className="submit-single-asset" type="submit">
                  Upload Single Asset
                </button>
              </div>
            </form>
          )}
        </>
      ) : (
        <LoaderSpinner height={45} width={45} message={"Job Sites"} />
      )}
      {logItem && logItem !== "fields not validated" &&
        <UploadSuccess
          rejectedLog={logItem.rejected}
          newAssets={logItem.accepted}
          locChoice={locationSelect}
        />
      }
    </section>
  );
}

export default SingleUpload;
