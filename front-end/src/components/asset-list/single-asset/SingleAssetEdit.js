import { useState } from "react";

import { updateAsset } from "../../../utils/api";
import generateHistoryKey from "../../../utils/generateHistoryKey";

function SingleAssetEdit({ singleAsset, accountLogged }) {
  const [assetFields, setAssetFields] = useState(...singleAsset);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  const changeHandler = (e) => {
    //create controlled input
    e.preventDefault();
    const { value, id } = e.currentTarget;
    setAssetFields({ ...assetFields, [id]: value });
  };

  const submitHandler = (e) => {
    //make a PUT request to submit asset update
    e.preventDefault();
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
            }
          ],
        })
      );
    }
    editAsset();
  };

  return (
    <section className="upload-container-style">
      <h3>Edit Asset Details</h3>
      <form className="form-container" onSubmit={submitHandler}>
        <div>
          <label htmlFor="asset_tag">Asset Tag</label>
          <input
            id="asset_tag"
            type="text"
            value={assetFields.asset_tag}
            onChange={changeHandler}
            placeholder={singleAsset[0].asset_tag}
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
            placeholder={singleAsset[0].serial_number}
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
            placeholder={singleAsset[0].make}
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
            placeholder={singleAsset[0].model}
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
            placeholder={singleAsset[0].hr}
          />
          <br />
        </div>
        <div className="fix-button">
          <button className="submit-single-asset" type="submit">
            Submit Change
          </button>
        </div>
      </form>
    </section>
  );
}

export default SingleAssetEdit;
