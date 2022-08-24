function validateSingleUpload(asset, assetList, siteIP) {
  const blankFields = []; //log of all errors to be returned from function
  const rejectionLog = [];
  const newAsset = [];
  let reject_err = '';
  //block upload if there are empty form fields

  // FORM VALIDATION //
  for (let key in asset) {
    if (asset[key] === "") {
      blankFields.push({
        message: `You must select an option for ${key}!`,
      });
    }
  }
  if (blankFields && blankFields.length !== 0) {
    window.confirm(
      `Fix the following issues: ${blankFields.map((issue, key) => issue.message )}`
    );
    return "fields not validated";
  } //if fields are not blank, check duplicates in existing inventory

  const validateAssetsByDatabase = () => {
    //add more form/frontend validation here
    if(assetList.find((existingAsset) => asset.serial_number === existingAsset.serial_number))
      reject_err = "Duplicate serial number found in database!";
    if(assetList.find((existingAsset) => asset.asset_tag === existingAsset.asset_tag))
      reject_err = "Duplicate asset tag found in database!";
  }

  //parse and validate siteIP
  const validateAndParseIP = () => {
    const splitIP = siteIP.value.split('.');
    if(splitIP.length !== 4) reject_err = "IP is formatted incorrectly!";
    console.log(splitIP)
  };
  

  if (blankFields && blankFields.length === 0) {
    validateAssetsByDatabase();
    validateAndParseIP();
    if (reject_err) {
      rejectionLog.push({
        asset_tag: asset.asset_tag,
        location: {
          site: asset.location.site, //use this to render upload log
        },
        status: "Needs Verified", //default on upload - **needs verified through foreman**
        serial_number: asset.serial_number,
        make: asset.make,
        model: asset.model,
        hr: asset.hr,
        history: asset.history,
        reject_err: reject_err
      });
    }else{
      newAsset.push({
        asset_tag: asset.asset_tag,
        location: {
          site: asset.location.site, //use this to render upload log
        },
        status: "Needs Verified", //default on upload - **needs verified through foreman**
        serial_number: asset.serial_number,
        make: asset.make,
        model: asset.model,
        hr: asset.hr,
        history: asset.history
      })
    }
  }
  return {accepted: newAsset, rejected: rejectionLog};
}

export default validateSingleUpload;
