function calculateValues(assetList) {
  // ASSET LIST ANALYTICS
  //calculate: hashing/up status, down status, repair, storage, retired status
  const assetValues = {
    totalNumOfAssets: 0,
    numOfHashing: 0,
    numInStorage: 0,
    numInRepair: 0,
    numRetired: 0,
    numNeedVerified: 0
  };
  if (assetList && assetList.length !== 0) {
    assetValues.totalNumOfAssets = assetList.length;

    assetList.forEach((asset) => {
      if (
        asset.status !== "Storage" &&
        asset.status !== "Repair" && //possibly make includes('repair') since we will be showing multiple repair sites eventually
        asset.status !== "Retired" &&
        asset.status !== "Needs Verified"
      ) {
        assetValues.numOfHashing++;
      } else if (asset.status === "Storage") {
        assetValues.numInStorage++;
      } else if (asset.status === "Repair") { //possibly includes(repair)
        assetValues.numInRepair++;
      } else if(asset.status === "Needs Verified"){
        assetValues.numNeedVerified++; 
      }else {
        assetValues.numRetired++;
      } //if not in storage, repair, deployment, or etc. must be retired?
    });

    return assetValues;
  }

  return assetValues;
}

export default calculateValues;
