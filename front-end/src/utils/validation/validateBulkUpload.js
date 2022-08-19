import generateHistoryKey from "../generateHistoryKey";

function validateBulkUpload(assetList, parsedAssets, accountLogged, jobSites) {
  const rejectionList = [];
  const newAssetList = [];
  //validate against data in database
  const validateAssetsByDatabaseAndCSV = (asset) => {
    //if incoming bulk upload list has an asset that matches a device in our database
    //by database
    if (assetList.find((existingAsset) => existingAsset.location === asset[0]))
      return "Duplicate location found in database!";
    if (
      assetList.find(
        (existingAsset) => existingAsset.serial_number === asset[1]
      )
    )
      return "Duplicate serial number found in database!";
    if (assetList.find((existingAsset) => existingAsset.asset_tag === asset[2]))
      return "Duplicate asset tag found in database!";
    //by csv
    if (parsedAssets.filter((a) => asset[0] === a[0]).length > 1)
      return "Duplicate location found in CSV file!";
    if (parsedAssets.filter((a) => asset[1] === a[1]).length > 1)
      return "Duplicate serial number found in CSV file!";
    if (parsedAssets.filter((a) => asset[2] === a[2]).length > 1)
      return "Duplicate asset tag found in CSV file!";
  };
  //setStatus of asset via locChoice
  const setStatus = () => {
    // if(targetSite && targetSite.category === "Live") return "Needs Verified";
    // if(targetSite && targetSite.category === "Repair") return "Repair";
    // if(targetSite && targetSite.category === "Storage") return "Storage";
    return "Hashing";
  };

  const parseLoc = (loc) => {
    //parse location column format -> "PA01-MDC01-01-01"
    //asset.location.site = find location matching site code (ie. PA01)
    //asset.location.site_loc = build IP
    try {
      if (jobSites) {
        const splitLoc = loc.split("-"); //break location into 4 index array
        const siteData = jobSites.find((js) => js.site_code === splitLoc[0]);
        const ip = {
          first_octet: siteData.first_octet,
          mdc: splitLoc[1].slice(-2),
          shelf: splitLoc[2],
          unit: splitLoc[3],
        };
        console.log(siteData.first_octet);
        //add more contraints to mdc, shelf, unit ranges and special cases
        return { site: siteData.physical_site_name, site_loc: ip };
      } else
        window.alert(
          "Either job site does not exist, or the site code in column 1 (ie. GA01) does not match any existing site codes!"
        );
    } catch (e) {
      console.log(e, "Parsing location data failed. No job site matches.");
    }
  };

  //check for 5 headers: asset tag, status, serial_number, make, model, hr
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
        .filter((val, key) => key !== 0) //skip first row for headers
        .forEach((asset) => {
          //builds out rejection list, and good asset list
          //first check if there is a duplicate in the existing list of assets
          const reject_err = validateAssetsByDatabaseAndCSV(asset);
          if (reject_err) {
            rejectionList.push({
              asset_tag: asset[2],
              location: {
                csv_index: parsedAssets.indexOf(asset) + 1, //use this to render upload log, remove key before making post request
              },
              status: "", //default on upload - **needs verified through foreman**
              serial_number: asset[1],
              make: asset[3],
              model: asset[4],
              hr: asset[5],
              reject_err: reject_err,
            });
          }
          //then check if there is a duplicate in the incoming upload list
          else {
            //create asset with property created_by or similar
            const action_date = new Date();
            newAssetList.push({
              asset_tag: asset[2],
              location: {
                ...parseLoc(asset[0]),
                csv_index: parsedAssets.indexOf(asset) + 1, //use this to render upload log, remove key before making post request
              },
              status: setStatus(), //default on upload - **needs verified through foreman**
              history: [
                {
                  action_date: action_date,
                  action_taken: "Bulk Upload",
                  action_by: accountLogged.account[0].name,
                  action_by_id: accountLogged.account[0].user_id,
                  action_comment: "Initial Upload",
                  action_key: newHistoryKey,
                },
              ],
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
