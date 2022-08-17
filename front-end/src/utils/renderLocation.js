//render our location in the correct format

const renderLocation = (asset) => {
  try {
    if (asset) {
      if (!asset.location.site_loc)
        return '';
      else
        return `${asset.location.site_loc.first_octet}.${asset.location.site_loc.mdc}.${asset.location.site_loc.shelf}.${asset.location.site_loc.unit}`;
    }
  } catch (e) {
    console.log(e, "Failed to format location.", asset);
  }
};

export default renderLocation;
