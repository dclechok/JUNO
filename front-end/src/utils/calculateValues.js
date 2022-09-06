function calculateValues(assetList) {
  // ASSET LIST ANALYTICS
  //calculate: hashing/up status, down status, repair, storage, retired status
  const assetValues = {
    totalNumOfAssets: 0,
    numOfHashing: 0,
    numInStorage: 0,
    numInRepair: 0,
    numRetired: 0,
    numNeedVerified: 0,
    numInTransfer: 0
  };
  if (assetList && assetList.length !== 0) {
    assetValues.totalNumOfAssets = assetList.length;

    assetList.forEach((asset) => {
      if (asset.status === "Hashing") assetValues.numOfHashing++;
      if (asset.status === "Storage") assetValues.numInStorage++;
      if (asset.status === "Repair") assetValues.numInRepair++;
      if(asset.status === "Needs Verified") assetValues.numNeedVerified++; 
      if(asset.status === "Pending Transfer") assetValues.numInTransfer++;
    });

    return assetValues;
  }
  return assetValues;
}

export default calculateValues;
