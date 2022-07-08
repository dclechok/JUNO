import "./Search.css";
import { useState } from "react";

function Search({ assetList, setFilteredAssetList }) {
  const [searchTag, setSearchTag] = useState("");
  const [radioCheck, setRadioCheck] = useState(true);

  function searchAssetList(defaultByIP) {
    const parsedSearchTag = {
      site_loc: searchTag.split(".")[0],
      mdc: searchTag.split(".")[1],
      shelf: searchTag.split(".")[2],
      unit: searchTag.split(".")[3],
    };
    //NEEDS VALIDATION//
    if (defaultByIP) {
      try {
        const result = assetList.filter((asset) => {
          if (
            asset.location.site_loc === parsedSearchTag.site_loc &&
            asset.location.mdc === parsedSearchTag.mdc &&
            asset.location.shelf === parsedSearchTag.shelf &&
            asset.location.unit === parsedSearchTag.unit
          )
            return asset;
        });
        if (result.length === 0) window.alert(`Sorry, IP not found!`);
        else setFilteredAssetList(result);
        //LOAD ASSET BY IP
      } catch (e) {
        console.log(e, "Finding device failed.");
      }
    } else {
      if (
        assetList.find(
          (asset) => asset.asset_tag.toLowerCase() === searchTag.toLowerCase()
        )
      ) {
        //SET NAV KEY
        setFilteredAssetList(
          assetList.filter(
            (asset) => asset.asset_tag.toLowerCase() === searchTag.toLowerCase()
          )
        ); //LOAD ASSET BY ASSET TAG
      } else {
        window.alert(`Sorry, Asset Tag not found!`);
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault(); //stop page from reload
    //check radio buttons
    try {
      searchAssetList(e.target.ip.checked);
    } catch (e) {
      window.alert("Asset list is not yet loaded.");
    }
    //search asset list - default ip radio button checked
    setSearchTag(""); //reset searchTag
  };

  const handleChange = (e) => {
    setSearchTag(e.target.value); //create controlled input
  };

  const handleRadioChange = (e) => {
    //alternate between radio buttons
    setRadioCheck(!radioCheck);
  };

  return (
    <div className="search-container">
      <form id="search-form" onSubmit={handleSubmit}>
        <input
          id="search"
          name="search"
          type="text"
          value={searchTag}
          onChange={handleChange}
        />
        <div className="radio-btns">
          <label htmlFor="by-ip" className="radio-label">
            By IP
          </label>
          <input
            type="radio"
            id="ip"
            name="by-ip"
            className="by-ip"
            checked={radioCheck}
            onChange={handleRadioChange}
          />
          <label htmlFor="by-assetTag" className="radio-label">
            By Asset Tag
          </label>
          <input
            type="radio"
            id="assetTag"
            name="by-asset-tag"
            checked={!radioCheck}
            onChange={handleRadioChange}
          />
        </div>
        <button
          type="submit"
          className="search-btn"
          value="Submit"
          form="search-form"
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default Search;
