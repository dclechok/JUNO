import { useEffect, useState } from "react";

//utils
import { updateAsset } from "../../../utils/api";
import LoaderSpinner from "../../LoaderSpinner";
import generateHistoryKey from "../../../utils/generateHistoryKey";

function SingleAssetEdit({ singleAsset, accountLogged }) {
  const [assetFields, setAssetFields] = useState({...singleAsset});
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [toggleButton, setToggleButton] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const changeHandler = (e) => {
    //create controlled input
    e.preventDefault();
    const { value, id } = e.currentTarget;
    setAssetFields({ ...assetFields, [id]: value });
  };
  useEffect(() => {
    if (updateSuccess && !updateSuccess.error)
      window.location.reload(false); //refresh component if update was successful
    else if (updateSuccess && updateSuccess.error) {
      setToggleButton(true);
      setErrorMsg(updateSuccess.error);
    }
  }, [setUpdateSuccess, updateSuccess]);

  const submitHandler = (e) => {
    //make a PUT request to submit asset update
    e.preventDefault();
    setToggleButton(false);
    const newHistoryKey = generateHistoryKey();
    const action_date = new Date();
    async function editAsset() {
      setUpdateSuccess(
        await updateAsset(assetFields.asset_id, {
          ...assetFields,
          history: [
            ...assetFields.history,
            {
              action_taken: "Edit Asset",
              action_date: action_date,
              action_by: accountLogged.account[0].name,
              action_by_id: accountLogged.account[0].user_id,
              action_key: newHistoryKey,
              action_comment: "Updated Miner Details",
            },
          ],
          updated_at: action_date
        }, accountLogged)
      );
    }
    editAsset();
  };

  return (
    <section className="upload-container-style">
      <h3>Edit Asset Details</h3>
      {toggleButton ? (
        <form className="form-container" onSubmit={submitHandler}>
          <div>
            <label htmlFor="asset_tag">Asset Tag</label><br />
            <input
              id="asset_tag"
              type="text"
              value={assetFields.asset_tag}
              onChange={changeHandler}
              placeholder={singleAsset.asset_tag}
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
              placeholder={singleAsset.serial_number}
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
              placeholder={singleAsset.make}
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
              placeholder={singleAsset.model}
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
              placeholder={singleAsset.hr}
            />
            <br />
          </div>
          <div className="fix-button">
            <button className="submit-single-asset" type="submit">
              Submit Change
            </button>
            {errorMsg && <p className="error-message">{errorMsg}</p>}
          </div>

        </form>
      ) : (
        <LoaderSpinner width={45} height={45} message={"New Asset Data"} />
      )}
    </section>
  );
}

export default SingleAssetEdit;
