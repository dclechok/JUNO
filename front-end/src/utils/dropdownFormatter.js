function dropdownFormatter(assetList, navPos, site, navKey) {
  const setOfDropdownVals = new Set(); //do not allow duplicates
  try {
    if (assetList.length !== 0 && site) { //make sure assetList is loaded, and site is loaded
        // FILTER ALL RESULTS BASED ON JOB SITES //
      const dropdownAssetList = assetList.filter((asset) => asset.location.site === site.physical_site_name); //all assets for jobsite
      if (navPos === "mdc"){
        dropdownAssetList.forEach(asset => setOfDropdownVals.add(asset.location.site_loc.mdc));
      }
        if (navPos === "shelf"){
          dropdownAssetList.forEach(asset => asset.location.site_loc.mdc === navKey.mdc && setOfDropdownVals.add(asset.location.site_loc.shelf));
        }
        if (navPos === "unit") {
          dropdownAssetList.forEach(asset => (asset.location.site_loc.mdc === navKey.mdc && asset.location.site_loc.shelf) === navKey.shelf && setOfDropdownVals.add(asset.location.site_loc.unit));
        }
      return Array.from(setOfDropdownVals);
    }
  } catch (e) {
    console.log(e, "Formatting dropdown list failed.");
  }

}

export default dropdownFormatter;
