function validateSingleUpload(asset, assetList, siteIP) {
  const blankFields = []; //log of all errors to be returned from function
  const rejectionLog = [];
  const newAsset = [];
  let newIP = {};
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
      `Fix the following issues: ${blankFields.map((issue, key) => issue.message)}`
    );
    return "fields not validated";
  } //if fields are not blank, check duplicates in existing inventory

  const validateAssetsByDatabase = () => {
    //add more form/frontend validation here
    if (assetList && assetList.find((existingAsset) => asset.serial_number === existingAsset.serial_number))
      reject_err = "Duplicate serial number found in database!";
    if (assetList && assetList.find((existingAsset) => asset.asset_tag === existingAsset.asset_tag))
      reject_err = "Duplicate asset tag found in database!";
  }

  //parse and validate siteIP
  const validateSetIP = () => {
    for (let locData in siteIP) {
      //validation
      if (siteIP[locData] === '') return reject_err = "IP data field(s) cannot be empty!";
      if (!siteIP[locData].split().find(char => char.charCodeAt() < 48 || char.charCodeAt() > 57)) return reject_err = "IP data must consist of numbers only! (Up to two digits)";
      //set our IP address to be loaded in post request
      if (siteIP[locData].length === 1) newIP[locData] = '0'.concat(siteIP[locData]); // if a single digit like 2 is entered, we add an 0 to make it a two digit octet "02"
      else newIP[locData] = siteIP[locData];

    }
    //check if slot is unavailable in our assetList (database)
    try {
      if (assetList && assetList.find(asset => {
        return (
          asset.location.site_loc.first_octet === newIP.first_octet &&
          asset.location.site_loc.mdc === newIP.mdc &&
          asset.location.site_loc.shelf === newIP.shelf &&
          asset.location.site_loc.unit === newIP.unit
        )
      })) return reject_err = `Invalid IP! There is already a device located at ${newIP.first_octet}.${newIP.mdc}.${newIP.shelf}.${newIP.unit}!`;
    } catch (e) { console.log(e, "Validating new IP data against existing IP data in JUNO database failed."); }
  };

  if (blankFields && blankFields.length === 0) {
    validateAssetsByDatabase();
    validateSetIP();
    if (reject_err) {
      rejectionLog.push({
        asset_tag: asset.asset_tag,
        location: {
          site: asset.location.site, //use this to render upload log
          site_loc: newIP
        },
        status: "Rejected", //default on upload - **needs verified through foreman**
        serial_number: asset.serial_number,
        make: asset.make,
        model: asset.model,
        hr: asset.hr,
        history: asset.history,
        reject_err: reject_err
      });
    } else {
      newAsset.push({
        asset_tag: asset.asset_tag,
        location: {
          site: asset.location.site, //use this to render upload log
          site_loc: newIP
        },
        serial_number: asset.serial_number,
        make: asset.make,
        model: asset.model,
        hr: asset.hr,
        history: asset.history
      })
    }
  }
  return { accepted: newAsset, rejected: rejectionLog };
}

export default validateSingleUpload;
