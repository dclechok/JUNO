function validateSiteForm(siteData){
    if(!siteData.physical_site_name) return window.alert("Job site must have a name!");
    if(!siteData.site_code) return window.alert("Job site must have a site code!");
    return true;
}

export default validateSiteForm;