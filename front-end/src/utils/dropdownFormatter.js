function dropdownFormatter(assetList, navPos, site) {
  const setOfDropdownVals = new Set(); //do not allow duplicates
  try {
    if (assetList.length !== 0 && site) { //make sure assetList is loaded, and site is loaded
        // FILTER ALL RESULTS BASED ON JOB SITES //
      const dropdownAssetList = assetList.filter((asset) => asset.location.site === site.physical_site_name);
      if (navPos === "mdc"){
        dropdownAssetList.sort(
          (a, b) => Number(a.location.site_loc.mdc) - Number(b.location.site_loc.mdc)
        );
        dropdownAssetList.forEach(asset => setOfDropdownVals.add(asset.location.site_loc.mdc));
      }
        if (navPos === "shelf"){
          dropdownAssetList.sort(
            (a, b) => Number(a.location.site_loc.shelf) - Number(b.location.site_loc.shelf)
          );
          dropdownAssetList.forEach(asset => setOfDropdownVals.add(asset.location.site_loc.shelf));
        }
        if (navPos === "unit") {
          dropdownAssetList.sort(
            (a, b) => Number(a.location.site_loc.unit) - Number(b.location.site_loc.unit)
          );
          dropdownAssetList.forEach(asset => setOfDropdownVals.add(asset.location.site_loc.unit));
        }
      return Array.from(setOfDropdownVals);
    }
  } catch (e) {
    console.log(e, "Formatting dropdown list failed.");
  }

}

export default dropdownFormatter;
