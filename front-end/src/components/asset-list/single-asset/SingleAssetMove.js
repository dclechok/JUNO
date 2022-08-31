import { useEffect, useState } from 'react';
import './SingleAssetMove.css';

//utils
import { getJobSites, getAllAssets } from '../../../utils/api';
import LoaderSpinner from '../../LoaderSpinner';
import validateLoc from '../../../utils/validation/validateLoc';
import { updateAsset } from '../../../utils/api';
import colorCodes from '../../../utils/colorCodes';

function SingleAssetMove({ singleAsset, accountLogged }) {
    const [jobSites, setJobSites] = useState(); //fetch all job sites
    const [assetList, setAssetList] = useState(); //fetch all current asset list
    const [selectedSite, setSelectedSite] = useState(); //selected site name from drop down
    const [site, setSite] = useState(); //to store our single site data
    const defaultIP = { site: '', site_loc: { first_octet: '', mdc: '', shelf: '', unit: '' } };
    const [currentLoc, setCurrentLoc] = useState(defaultIP);
    const [locUpdatedSuccess, setLocUpdatedSuccess] = useState(null);
    const [toggleBtn, setToggleBtn] = useState(true);
    const [moveSuccessful, setMoveSuccessful] = useState(false);
    const [cat, setCat] = useState(null); //storing the current category of job site

    useEffect(() => {
        async function getAllSites() {
            setJobSites(await getJobSites());
        }
        getAllSites();
        setSelectedSite(singleAsset.location.site)
    }, []);

    useEffect(() => {
        async function getAssets() {
            setAssetList(await getAllAssets());
        }
        getAssets();
    }, []);

    const changeHandler = (e) => {
        e.preventDefault();
        setSelectedSite(e.currentTarget.value);
    };

    const setStatus = () => {
        if (site && site.category === "production") return "Hashing";
        if (site && site.category === "repair") return "Repair";
        if (site && site.category === "storage") return "Storage";
    };

    console.log(currentLoc)
    useEffect(() => { //find job site from selected job site drop down
        const abortController = new AbortController();
        if (jobSites) setSite(jobSites.find(site => site.physical_site_name === selectedSite))
        return () => abortController.abort();
    }, [jobSites, setJobSites, selectedSite, setSelectedSite]);
// console.log(((site && site.category === "production") && singleAsset && site.physical_site_name === singleAsset.location.site))
    useEffect(() => { //update current location to match jobsite
        const abortController = new AbortController();
        //if the site is production and matches the site the singleAsset belongs to, fill the form fields with existing location data
        if (((site && site.category === "production") && singleAsset && site.physical_site_name !== singleAsset.location.site)){
            setCurrentLoc({ site: site.physical_site_name, site_loc: { first_octet: site.first_octet } });
        }
        else if (((site && site.category === "production") && singleAsset && site.physical_site_name === singleAsset.location.site)) {
            console.log('hello')
            setCurrentLoc({ site: site.physical_site_name, site_loc: { first_octet: site.first_octet, mdc: singleAsset.location.site_loc.mdc, shelf: singleAsset.location.site_loc.shelf, unit: singleAsset.location.site_loc.unit } });
        }
        else setCurrentLoc({ ...defaultIP, site: selectedSite }); //otherwise clear the current working IP
        return abortController.abort();
    }, [jobSites, setJobSites, site, setSite, selectedSite, setSelectedSite]);
    
    const changeIPHandler = (e) => {
        e.preventDefault();
        const { id, value } = e.currentTarget;
        setCurrentLoc({ ...currentLoc, ["site_loc"]: { ...currentLoc.site_loc, [id]: value } });
    };

    const submitHandler = (e) => {
        //validate location
        e.preventDefault();
        setMoveSuccessful(false); //move is not successful yet
        //returns object if location is valid, or error string
        let validated = '';
        if (site.category === "production") validated = validateLoc(currentLoc, singleAsset, assetList);
        else validated = { site: site.physical_site_name, site_loc: defaultIP.site_loc }; //if job site is not production (ie. no ip should exist) then set site_loc fields to empty
        if (typeof validated === "string") {
            window.alert(validated);
        } else {
            setToggleBtn(false); //set to loading screen
            async function postNewLocData() {
                setLocUpdatedSuccess(await updateAsset(singleAsset.asset_id, { ...singleAsset, location: validated, status: setStatus() }));
            }
            postNewLocData();
        }
    };
    // console.log(currentLoc)
    useEffect(() => {
        if (locUpdatedSuccess && !locUpdatedSuccess.error) {
            setToggleBtn(true); //toggle loading spinner
            setMoveSuccessful(true); //toggle success message
            window.location.reload(); //reload component so single asset info is updated with new data
        }
    }, [locUpdatedSuccess]);
    // console.log(currentLoc)
    return (
        <div>
            {jobSites && assetList && toggleBtn && site ?
                <form id="move-asset-form" className="upload-container" onSubmit={submitHandler}>
                    <h3>Current Device Location: {singleAsset.location.site}{singleAsset.location.site_loc.first_octet !== "" ? <span>- {singleAsset.location.site_loc.first_octet}.{singleAsset.location.site_loc.mdc}.{singleAsset.location.site_loc.shelf}.{singleAsset.location.site_loc.unit}</span> : <></>}</h3>
                    <div className='move-input-container'>
                        <select onChange={changeHandler} defaultValue={selectedSite}>
                            {jobSites.map((js, key) => {
                                return <option key={key} value={js.physical_site_name}>{js.physical_site_name}</option>
                            })}
                        </select>
                        {site && site.category === "production" && currentLoc &&
                            <div className='ip-inputs'> -
                                <input type="text" id="first_octet" defaultValue={site.first_octet} readOnly maxLength="2" />.
                                <input type="text" id="mdc" value={currentLoc.site_loc.mdc} onChange={changeIPHandler} maxLength="2" /> .
                                <input type="text" id="shelf" value={currentLoc.site_loc.shelf} onChange={changeIPHandler} maxLength="2" /> .
                                <input type="text" id="unit" value={currentLoc.site_loc.unit} onChange={changeIPHandler} maxLength="2" />
                            </div>}
                    </div>
                    {moveSuccessful && locUpdatedSuccess && <div className='move-success'>{cat === "production" ? <p style={{ color: colorCodes["Active"] }}>Move to {locUpdatedSuccess.data.location.site} - {locUpdatedSuccess.data.location.site_loc.first_octet}.{locUpdatedSuccess.data.location.site_loc.mdc}.{locUpdatedSuccess.data.location.site_loc.shelf}.{locUpdatedSuccess.data.location.site_loc.unit} - Successful!</p> : <p>Move to {locUpdatedSuccess.data.location.site} Successful!</p>}</div>}
                    <button className="submit-move-btn" type="submit" form='move-asset-form'>
                        Move Asset
                    </button>
                    <button className="submit-move-btn">
                        Cancel
                    </button>
                </form> : <LoaderSpinner height={45} width={45} message={"Data"} />}
        </div>
    );
}

export default SingleAssetMove;