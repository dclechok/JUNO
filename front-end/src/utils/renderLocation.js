//render our location in the correct format

const renderLocation = (asset) => {
  try {
    if (asset) {
      if (asset.location.site_loc && !asset.location.site_loc.includes("10"))
        return '';
      else
        return `${asset.location.site_loc}.${asset.location.mdc}.${asset.location.shelf}.${asset.location.unit}`;
    }
  } catch (e) {
    console.log(e, "Failed to format location.", asset);
  }
};

export default renderLocation;
