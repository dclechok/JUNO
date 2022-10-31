import "./UploadContainersStyle.css";
import { useEffect, useState } from "react";
import generateHistoryKey from "../../utils/generateHistoryKey";

//components
import UploadSuccess from "./UploadSuccess.js";
import LoaderSpinner from "../LoaderSpinner.js";

//utils
import { getJobSites, getAllAssets, createAsset } from "../../utils/api.js";
import validateSingleUpload from "../../utils/validation/validateSingleUpload";

function SingleUpload({ accountLogged }) {
  const [jobSites, setJobSites] = useState([]);
  const [locationSelect, setLocationSelect] = useState("All Locations");
  const [logItem, setLogItem] = useState();
  const [targetSite, setTargetSite] = useState();
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [toggleIp, setToggleIp] = useState(false); //used for toggling IP fields when target site category is "production"
  const defaultSiteIP = { first_octet: '', mdc: '', shelf: '', unit: '' };
  const [siteIP, setSiteIP] = useState(defaultSiteIP);
  const [assetList, setAssetList] = useState([]);
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
    async function loadAllAssets(){
      setAssetList(await getAllAssets());
    }
    loadAllAssets();
  }, [uploadSuccess, setUploadSuccess]);

  useEffect(() => {
    if (locationSelect && locationSelect !== '-- select an option --') {
      setTargetSite(jobSites.find(js => {
        if (js.physical_site_name === locationSelect) return js.category;
      }));
    } else setTargetSite('');

  }, [locationSelect, setLocationSelect])

  useEffect(() => {
    if (targetSite){
      setSiteIP({ first_octet: targetSite.first_octet });
      if(targetSite.category === "production") setToggleIp(true);
      else setToggleIp(false);
    }
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
    acceptOrReject = validateSingleUpload(assetFields, assetList, siteIP, targetSite.category, accountLogged);
    // make POST request
    if (acceptOrReject !== "fields not validated") {
      setLogItem(acceptOrReject);
      if (acceptOrReject.rejected.length === 0 && acceptOrReject.accepted.length > 0) {
        const action_date = new Date();
        const newHistoryKey = generateHistoryKey(); //generate unique history key ("action_key")
        async function postSingleAsset() {
          setUploadSuccess(await createAsset(
            {
              ...acceptOrReject.accepted[0],
              status: setStatus(),
              history: [
                {
                  action_taken: "Single Upload",
                  action_date: JSON.stringify(action_date),
                  action_by: accountLogged.name,
                  action_by_id: accountLogged.user_id,
                  action_key: newHistoryKey,
                  action_comment: "Initial Upload"
                },
              ],
            },
          ));
        }
        postSingleAsset();
      }
    }
  };
  //clear data once submitted 
  useEffect(() => {
    if(uploadSuccess){
      setAssetFields('');
      setSiteIP('');
      // window.location.reload();
    } 
  }, [uploadSuccess]);

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
      {jobSites && jobSites.length !== 0 && jobSites.find(js => js.status === "Active") ? (
        <>
          {!uploadSuccess && !logItem && (
            <form className="form-container stack-inputs" onSubmit={submitHandler}>
              <div className="select-margin">
                <label htmlFor="location">Location</label>
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
              </div>
              <div className="ip-inputs">
                {toggleIp &&
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
                </fieldset>}
              </div>
              <div className="label-input-flex">
                <label htmlFor="asset_tag">Asset Tag</label>
                <input
                  className="float-input-right"
                  id="asset_tag"
                  type="text"
                  value={assetFields.asset_tag}
                  onChange={changeHandler}
                />
              </div>
              <div className="label-input-flex">
                <label htmlFor="serial-number">Serial #</label>
                <input
                  className="float-input-right"
                  id="serial_number"
                  type="text"
                  value={assetFields.serial_number}
                  onChange={changeHandler}
                />
              </div>
              <div className="label-input-flex">
                <label htmlFor="make">Make</label>
                <input
                  className="float-input-right"
                  id="make"
                  type="text"
                  value={assetFields.make}
                  onChange={changeHandler}
                />
              </div>
              <div className="label-input-flex">
                <label htmlFor="model">Model</label>
                <input
                  className="float-input-right"
                  id="model"
                  type="text"
                  value={assetFields.model}
                  onChange={changeHandler}
                />
              </div>
              <div className="label-input-flex">
                <label htmlFor="hr">Hashrate</label><br />
                <input
                className="float-input-right"
                  id="hr"
                  type="text"
                  value={assetFields.hr}
                  onChange={changeHandler}
                />
              </div>
              <div className="fix-button">
                <button type="submit">
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
        />
      }
    </section>
  );
}

export default SingleUpload;
