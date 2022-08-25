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
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const defaultSiteIP = { first_octet: '', mdc: '', shelf: '', unit: '' };
  const [siteIP, setSiteIP] = useState(defaultSiteIP);
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
      location: { site: e.currentTarget.value },
    });
  };
  useEffect(() => {
    if (locationSelect && locationSelect !== '-- select an option --') {
      setTargetSite(jobSites.find(js => {
        if (js.physical_site_name === locationSelect) return js.category;
      }));
    } else setTargetSite('');

  }, [locationSelect, setLocationSelect])

  useEffect(() => {
    if (targetSite) setSiteIP({ first_octet: targetSite.first_octet });
    else setSiteIP(defaultSiteIP);
  }, [targetSite, setTargetSite]);

  const setStatus = () => {
    if (targetSite && targetSite.category === "production") return "Hashing";
    if (targetSite && targetSite.category === "repair") return "Repair";
    if (targetSite && targetSite.category === "storage") return "Storage";
  };
  //handling state of IP fields
  const changeIPHandler = (e) => {
    e.preventDefault();
    const { id, value } = e.currentTarget;
    setSiteIP({ ...siteIP, [id]: value });
  };
  
  const changeHandler = (e) => {
    //create controlled input
    e.preventDefault();
    const { value, id } = e.currentTarget;
    setAssetFields({ ...assetFields, [id]: value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    acceptOrReject = validateSingleUpload(assetFields, assetList, siteIP);
    // make POST request
    if (acceptOrReject !== "fields not validated") {
      setLogItem(acceptOrReject);
      if (acceptOrReject.rejected.length === 0 && acceptOrReject.accepted.length > 0) {
        const action_date = new Date();
        const newHistoryKey = generateHistoryKey(); //generate unique history key ("action_key")
        console.log(acceptOrReject.accepted)
        async function postSingleAsset() {
          setUploadSuccess(await createAsset(
            {
              ...acceptOrReject.accepted[0],
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
  console.log(uploadSuccess)
  //clear data once submitted 
  useEffect(() => {
    if(uploadSuccess){
      setAssetFields('');
      setSiteIP('');
    } 
  }, [uploadSuccess, setUploadSuccess]);

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
          {!uploadSuccess && !logItem && (
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
              </div>                <br />
              <div className="ip-inputs">
                <fieldset>
                  <legend>IP ("xx.xx.xx.xx")</legend>
                  <input
                    onChange={changeIPHandler}
                    form="ip-form"
                    id="first_octet"
                    type="text"
                    value={siteIP.first_octet}
                    maxLength="2"
                    readOnly
                  />&nbsp;.&nbsp;
                  <input
                    onChange={changeIPHandler}
                    form="ip-form"
                    id="mdc"
                    type="text"
                    value={siteIP.mdc}
                    maxLength="2"
                  />&nbsp;.&nbsp;
                  <input
                    onChange={changeIPHandler}
                    form="ip-form"
                    id="shelf"
                    type="text"
                    value={siteIP.shelf}
                    maxLength="2"
                  />&nbsp;.&nbsp;
                  <input
                    onChange={changeIPHandler}
                    form="ip-form"
                    id="unit"
                    type="text"
                    value={siteIP.unit}
                    maxLength="2"
                  />
                </fieldset>
              </div><br />
              <div>
                <label htmlFor="asset_tag">Asset Tag</label><br />
                <input
                  id="asset_tag"
                  type="text"
                  value={assetFields.asset_tag}
                  onChange={changeHandler}
                />
                <br />
              </div>
              <div>
                <label htmlFor="serial-number">Serial #</label><br />
                <input
                  id="serial_number"
                  type="text"
                  value={assetFields.serial_number}
                  onChange={changeHandler}
                />
                <br />

              </div>

              <div>
                <label htmlFor="make">Make</label><br />
                <input
                  id="make"
                  type="text"
                  value={assetFields.make}
                  onChange={changeHandler}
                />
                <br />
              </div>
              <div>
                <label htmlFor="model">Model</label><br />
                <input
                  id="model"
                  type="text"
                  value={assetFields.model}
                  onChange={changeHandler}
                />
                <br />
              </div>
              <div>
                <label htmlFor="hr">Hashrate</label><br />
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
      {/* {logItem && logItem !== "fields not validated" &&
        <UploadSuccess
          rejectedLog={logItem.rejected}
          newAssets={logItem.accepted}
          uploadSuccess={uploadSuccess}
        />
      } */}
    </section>
  );
}

export default SingleUpload;
