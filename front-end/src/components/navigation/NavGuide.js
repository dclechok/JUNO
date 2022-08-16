import "./NavGuide.css";
import { useEffect, useState } from "react";

//utils
import dropdownFormatter from "../../utils/dropdownFormatter";

function NavGuide({
  navKey,
  setNavKey,
  formattedKey,
  setFormattedKey,
  setLoadAssets,
  loadAssets,
  filteredAssetList,
  jobSites
}) {
  //for disabling/enabling dropdowns
  const [mdcDisabled, setMdcDisabled] = useState(true);
  const [shelfDisabled, setShelfDisabled] = useState(true);
  const [unitDisabled, setUnitDisabled] = useState(true);
  //default values of our select drop downs
  const mdcDefaultVal = "All MDC's";
  const shelfDefaultVal = "All Shelves";
  const unitDefaultVal = "All Units";
  const [site, setSite] = useState(""); //which site we're currently wanting to view the details of
  const [mdcSelectVal, setMdcSelectVal] = useState(""); //make mdc select controlled
  const [shelfSelectVal, setShelfSelectVal] = useState("");
  const [unitSelectVal, setUnitSelectVal] = useState("");

  const selectSiteHandler = (e) => {
    const { value } = e.currentTarget;
    setMdcDisabled(true);
    setShelfDisabled(true);
    setUnitDisabled(true);
    setMdcSelectVal(mdcDefaultVal);
    if (value.includes("All")) {
      //attempting to reset select-option values to defaults when disabling them
      setNavKey({ site: value, mdc: "00", shelf: "00", unit: "00" });
    } else{
      setSite(JSON.parse(value));
      setMdcDisabled(false);
      setNavKey({ site: { physical_site_name: JSON.parse(value).physical_site_name, first_octet: JSON.parse(value).first_octet }, mdc: "00", shelf: "00", unit: "00" });
    }
  };

  const selectMdcHandler = (e) => {
    //set mdc in nav key, and handle nav resets
    const { value } = e.currentTarget;
    setMdcSelectVal(value);
    setShelfSelectVal(shelfDefaultVal);
    setShelfDisabled(true);
    setUnitDisabled(true);
    if (value === "00") {
      // setShelfDisabled(true);
      setUnitDisabled(true);
    } else{
      setNavKey({ ...navKey, mdc: "00", shelf: "00", unit: "00" });
      setShelfDisabled(false);
    };
    setNavKey({ ...navKey, mdc: value, shelf: "00", unit: "00" });
  };
  const selectShelfHandler = (e) => {
    //set shelves in nav key, and handle nav resets
    const { value } = e.currentTarget;
    setShelfSelectVal(value);
    setUnitSelectVal(unitDefaultVal);
    setUnitDisabled(true);
    if (value === "00") {
      setNavKey({ ...navKey, unit: "00" });
    } else{
      setUnitDisabled(false);
      // setUnitDefaultVal(unitDefaultVal);
      setNavKey({ ...navKey, shelf: "00", unit: "00" });
      // setUnitDisabled(false);
    }
    setNavKey({ ...navKey, shelf: value, unit: "00" });
  };
  const selectUnitHandler = (e) => {
    //set units in nav key, and handle nav resets
    const { value } = e.currentTarget;
    setUnitSelectVal(value);
    if(value === "00"){
      setNavKey({ ...navKey, unit: "00" });
      // setUnitDisabled(!unitDisabled);
    }else{
      setNavKey({ ...navKey, unit: value });
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    setLoadAssets(!loadAssets); //toggle loading of asset lists
    return () => abortController.abort();
  }, [navKey, setNavKey]);
  //format 'viewing' nav key
  //eventually load 'viewing' after 'go'
  useEffect(() => {
    let key = "";
    if (JSON.stringify(navKey.site).includes("All")) setFormattedKey(`${navKey.site}`);
    else {
      key += navKey.site === "All Assets" ? "All Assets" : `${navKey.site.physical_site_name} - ${navKey.site.first_octet ? navKey.site.first_octet : 'xx'}`;
      key += navKey.mdc === "00" ? ".xx" : `.${navKey.mdc}`;
      key += navKey.shelf === "00" ? ".xx" : `.${navKey.shelf}`;
      key += navKey.unit === "00" ? ".xx" : `.${navKey.unit}`;
      setFormattedKey(key);
    }
  }, [setNavKey, filteredAssetList]);

  return (
    <form className="nav-guide-container" id="filter-form" >
      <select name="site" id="site" onChange={selectSiteHandler} >
        <option value="All Assets" defaultValue>
          All Assets
        </option>
        <option value="All Live">All Live</option>
        <option value="All Repairs">All Repairs</option>
        <option value="All Storage">All Storage</option>
        {jobSites && jobSites.map((site, key) => {
          if(site.status === "Active")
          return <option value={JSON.stringify({physical_site_name: site.physical_site_name, first_octet: site.first_octet})} key={key + 1}>{site.physical_site_name}{site.first_octet && ` - ${site.first_octet}`}</option>
        })}
      </select>
      <select
        name="mdc"
        id="mdc"
        onChange={selectMdcHandler}
        disabled={mdcDisabled}
        value={mdcSelectVal}
      ><option value="00" defaultValue>
      {mdcDefaultVal}
    </option>
        {!mdcDisabled && filteredAssetList.length !== 0 && dropdownFormatter(filteredAssetList, "mdc", site).sort((a, b) => Number(a) - Number(b)).map((mdc, key) => {
          if(mdc) return <option value={mdc} key={key}>MDC {mdc}</option>
        })}
      </select>
      <select
        name="shelf"
        id="shelf"
        onChange={selectShelfHandler}
        disabled={shelfDisabled}
        value={shelfSelectVal}
      >
        <option value="00" defaultValue>
          {shelfDefaultVal}
        </option>
        {!shelfDisabled && !mdcDisabled && dropdownFormatter(filteredAssetList, "shelf", site).sort((a, b) => Number(a) - Number(b)).map((shelf, key) => {
          if(shelf) return <option value={shelf} key={key + 1}>Shelf {shelf}</option>
        })}
      </select>
      <select
        name="unit"
        id="unit"
        onChange={selectUnitHandler}
        disabled={unitDisabled}
        value={unitSelectVal}
      >
        <option value="00" defaultValue>
          {unitDefaultVal}
        </option>
        {!mdcDisabled && !shelfDisabled && !unitDisabled && dropdownFormatter(filteredAssetList, "unit", site).map((unit, key) => {
          if(unit) return <option value={unit} key={key + 1}>Unit {unit}</option>
        })}
      </select>
      <p className="viewing">
        Viewing:&#160;&#160;<span className="ip-color">{formattedKey} - Total: {filteredAssetList.length} Asset{filteredAssetList.length > 1 && 's'}</span>
      </p>
    </form>
  );
}

export default NavGuide;
