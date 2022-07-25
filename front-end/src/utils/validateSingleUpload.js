function validateSingleUpload(asset, assetList) {
  const blankFields = []; //log of all errors to be returned from function
  const rejectionLog = [];
  const newAsset = [];
  //block upload if there are empty form fields

  for (let key in asset) {
    if (asset[key] === "") {
      blankFields.push({
        message: `You must select an option for ${key}!`,
      });
    }
  }
  if (blankFields && blankFields.length !== 0) {
    window.confirm(
      `Fix the following issues: ${blankFields.map((issue, key) => {
        return issue.message;
      })}`
    );
    return "fields not validated";
  } //if fields are not blank, check duplicates in existing inventory
  if (blankFields && blankFields.length === 0) {
    if (
      assetList.find((existingAsset) => {
        return asset.serial_number === existingAsset.serial_number;
      })
    ) {
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
