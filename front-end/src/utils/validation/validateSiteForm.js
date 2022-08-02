function validateSiteForm(siteData, allJobSites) {
  //allJobSites when creating to check to see if there are duplicates
  console.log(siteData.physical_site_id);
  if (!siteData.physical_site_name)
    return window.alert("Job site must have a name!");
  if (!siteData.site_code)
    return window.alert("Job site must have a site code!");
  if (
    allJobSites &&
    allJobSites.find(
      (js) =>
        (js.physical_site_name === siteData.physical_site_name &&
        js.physical_site_id !== siteData.physical_site_id)
    )
  )
    return window.alert(
      `Site name "${siteData.physical_site_name}" already exists!"`
    );
  if (
    allJobSites &&
    allJobSites.find(
      (js) =>
        js.site_code === siteData.site_code &&
        js.physical_site_id !== siteData.physical_site_id
    )
  )
    return window.alert(`Site code "${siteData.site_code}" already exists!`);
  return true;
}

export default validateSiteForm;
