function validateSiteForm(siteData, allJobSites) {
  //allJobSites when creating to check to see if there are duplicates
  if (siteData.category === "production" && !siteData.first_octet)
    return window.alert("Production job sites must have a first octet property!");
  if (!siteData.category)
    return window.alert("You must select a category for the job site to belong to!");
  if (!siteData.physical_site_name)
    return window.alert("Job site must have a name!");
  if (siteData.physical_site_name.length > 25)
    return window.alert("Site name length must be less than 25 characters!");
  if (!siteData.site_code)
    return window.alert("Job site must have a site code!");
  if (siteData.category === "production" && siteData.first_octet.length !== 2)
    return window.alert("Job site first octet must be two numeric digits!");
  if(siteData.first_octet.split().find(char => char.charCodeAt() < 48 || char.charCodeAt() > 57))
    return window.alert("Job site first octet can be numbers only!");
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
