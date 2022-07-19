import generateHistoryKey from "./generateHistoryKey";

function validateBulkUpload(assetList, parsedAssets, accountLogged) {
  const rejectionList = [];
  const newAssetList = [];

  const duplicatesInExistingList = (asset) => {
    //if incoming bulk upload list has an asset that matches a device in our system
    //by serial number
    return assetList.find((existingAsset) => {
      return existingAsset.serial_number === asset[1];
    });
  };
  //check for 6 headers: asset tag, location, status, serial_number, make, model, hr\

  if (
    parsedAssets[0][0].toLowerCase() === "location" &&
    parsedAssets[0][1].toLowerCase() === "serial #" &&
    parsedAssets[0][2].toLowerCase() === "asset #" &&
    parsedAssets[0][3].toLowerCase() === "make" &&
    parsedAssets[0][4].toLowerCase() === "model" &&
    parsedAssets[0][5].toLowerCase() === "hashrate"
  ) {
    try {
      //if valid headers exist, then filter the assets
      const newHistoryKey = generateHistoryKey();
      parsedAssets
        .filter((val, key) => key !== 0 && key <= 100) //skip first row for headers
        .forEach((asset) => {
          //builds out rejection list, and good asset list
          //first check if there is a duplicate in the existing list of assets
          //add more middleware here
          if (duplicatesInExistingList(asset)) {
            rejectionList.push({
              asset_tag: asset[2],
              location: {
                csv_index: parsedAssets.indexOf(asset) + 1, //use this to render upload log, remove key before making post request
              },
              status: "Needs Verified", //default on upload - **needs verified through foreman**
              serial_number: asset[1],
              make: asset[3],
              model: asset[4],
              hr: asset[5],
            });
          }
          //then check if there is a duplicate in the incoming upload list
          else {
            //create asset with property created_by or similar
            const action_date = new Date();
            newAssetList.push({
              asset_tag: asset[2],
              location: {
                site: asset[0].includes("PA01") ? "Midland, PA" : "", //refers to physical site
                site_loc: "", //refers to IP - null until verified through Foreman
                csv_index: parsedAssets.indexOf(asset) + 1, //use this to render upload log, remove key before making post request
              },
              status: "Needs Verified", //default on upload - **needs verified through foreman**
              history: {
                action_date: action_date,
                action_taken: "Bulk Upload",
                action_by: accountLogged.account[0].name,
                action_by_id: accountLogged.account[0].user_id,
                action_comment: "Initial Upload",
                action_key: newHistoryKey,
              },
              serial_number: asset[1],
              make: asset[3],
              model: asset[4],
              hr: asset[5],
            });
          }
        });
      return { accepted: newAssetList, rejected: rejectionList };
    } catch (e) {
      console.log(e, "Parsing and validating .csv failed!");
    }
  } else {
    window.alert(
      "Invalid Headers: Please review template format for required headers!"
    );
  }
}

export default validateBulkUpload;
