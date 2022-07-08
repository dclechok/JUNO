function dropdownFormatter(assetList, navPos, site) {

  const setOfDropdownVals = new Set(); //do not allow duplicates

  try {
    if (assetList.length !== 0 && site) { //make sure assetList is loaded, and site is loaded
        // FILTER ALL RESULTS BASED ON JOB SITES //
      const dropdownAssetList = assetList.filter((asset) => {
        if (asset.status === "Needs Verified") return asset.location.site === site;
      });

      if (navPos === "mdc"){
        dropdownAssetList.sort(
          (a, b) => Number(a.location.mdc) - Number(b.location.mdc)
        );
        dropdownAssetList.forEach(asset => setOfDropdownVals.add(asset.location.mdc));
      }
        if (navPos === "shelf"){
          dropdownAssetList.sort(
            (a, b) => Number(a.location.shelf) - Number(b.location.shelf)
          );
          dropdownAssetList.forEach(asset => setOfDropdownVals.add(asset.location.shelf));
        }
        if (navPos === "unit") {
          dropdownAssetList.sort(
            (a, b) => Number(a.location.unit) - Number(b.location.unit)
          );
          dropdownAssetList.forEach(asset => setOfDropdownVals.add(asset.location.unit));
        }
      return Array.from(setOfDropdownVals);
    }
  } catch (e) {
    console.log(e, "Formatting dropdown list failed.");
  }

}

export default dropdownFormatter;
