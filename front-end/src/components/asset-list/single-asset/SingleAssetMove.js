import { useEffect, useState } from 'react';
import './SingleAssetMove.css';

//utils
import { getJobSites, getAllAssets } from '../../../utils/api';
import LoaderSpinner from '../../LoaderSpinner';
import validateLoc from '../../../utils/validation/validateLoc';
import { updateAsset } from '../../../utils/api';
import colorCodes from '../../../utils/colorCodes';
import generateHistoryKey from '../../../utils/generateHistoryKey';

function SingleAssetMove({ singleAsset, accountLogged }) {
    const [jobSites, setJobSites] = useState(); //fetch all job sites
    const [assetList, setAssetList] = useState(); //fetch all current asset list
    const [selectedSite, setSelectedSite] = useState('-- Select Site --'); //selected site name from drop down
    const defaultIP = { site: '-- Select Site --', site_loc: { first_octet: '', mdc: '', shelf: '', unit: '' } };
    const [site, setSite] = useState(); //to store our single site data
    const [currentLoc, setCurrentLoc] = useState(defaultIP);
    const [locUpdatedSuccess, setLocUpdatedSuccess] = useState(null);
    const [toggleBtn, setToggleBtn] = useState(true);
    const [moveSuccessful, setMoveSuccessful] = useState(false);
    const [cat, setCat] = useState(null); //storing the current category of job site
    const [activeJobsiteCount, setActiveJobsiteCount] = useState();

    useEffect(() => {
        const abortController = new AbortController();
        async function getAllSites() {
            setJobSites(await getJobSites());
        }
        getAllSites();
        return () => abortController.abort();
    }, []);

    useEffect(() => {
        const abortController = new AbortController();
        async function getAssets() {
            setAssetList(await getAllAssets());
        }
        getAssets();
        return () => abortController.abort();
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

    useEffect(() => { //find job site from selected job site drop down
        const abortController = new AbortController();
        if(jobSites) setActiveJobsiteCount(jobSites.filter(site => site.status === 'Active').length)
        if(jobSites && selectedSite !== "-- Select Site --") setSite(jobSites.find(site => site.physical_site_name === selectedSite))
        else setSite({ physical_site_name: selectedSite, category: '' });
        return () => abortController.abort();
    }, [jobSites, setJobSites, selectedSite, setSelectedSite]);

    useEffect(() => { //update current location to match jobsite
        const abortController = new AbortController();
        //if the site is production and matches the site the singleAsset belongs to, fill the form fields with existing location data
        if (site) setCat(site && site.category);
        if ((site && site.category === "production" && singleAsset && site.physical_site_name !== singleAsset.location.site)) {
            setCurrentLoc({ site: site.physical_site_name, site_loc: { first_octet: site.first_octet, mdc: defaultIP.mdc, shelf: defaultIP.shelf, unit: defaultIP.unit } });
        }
        else if ((site && site.category === "production" && singleAsset && site.physical_site_name === singleAsset.location.site)) {
            setCurrentLoc({ site: site.physical_site_name, site_loc: { first_octet: site.first_octet, mdc: singleAsset.location.site_loc.mdc, shelf: singleAsset.location.site_loc.shelf, unit: singleAsset.location.site_loc.unit } });
        }
        else setCurrentLoc({ ...defaultIP, site: selectedSite }); //otherwise clear the current working IP
        return abortController.abort();
    }, [site, setSite, selectedSite, setSelectedSite]);

    const changeIPHandler = (e) => {
        e.preventDefault();
        const { id, value } = e.currentTarget;
        setCurrentLoc({ ...currentLoc, ["site_loc"]: { ...currentLoc.site_loc, [id]: value } });
    };

    const formatLoc = () => {
        if (currentLoc.site_loc.first_octet) return `${currentLoc.site} - ${currentLoc.site_loc.first_octet}.${currentLoc.site_loc.mdc}.${currentLoc.site_loc.shelf}.${currentLoc.site_loc.unit}`
        else return `${currentLoc.site}`;
    };

    const formatLocLabel = () => {
        if(!locUpdatedSuccess){
            if(singleAsset.location.site && singleAsset.location.site_loc.first_octet !== "") return `${singleAsset.location.site} - ${singleAsset.location.site_loc.first_octet}.${singleAsset.location.site_loc.mdc}.${singleAsset.location.site_loc.shelf}.${singleAsset.location.site_loc.unit}`;
            else return `${singleAsset.location.site}`;
        }
        else{
            if(locUpdatedSuccess.data.location.site && locUpdatedSuccess.data.location.site_loc.first_octet !== "") return `${locUpdatedSuccess.data.location.site} - ${locUpdatedSuccess.data.location.site_loc.first_octet}.${locUpdatedSuccess.data.location.site_loc.mdc}.${locUpdatedSuccess.data.location.site_loc.shelf}.${locUpdatedSuccess.data.location.site_loc.unit}`;
            else return `${locUpdatedSuccess.data.location.site}`;
        }
        //if single asset has location but no first_octet (aka non-production site like DRAP)
        //if a single asset has a location and a first octet (aka production)
        //if a successful move occurs, the location label should change to updated label
    };

    const submitHandler = (e) => {
        //validate location
        e.preventDefault();
        if (selectedSite !== "-- Select Site --") {
            setMoveSuccessful(false); //move is not successful yet
            //returns object if location is valid, or error string
            let validated = '';
            if (site && site.category === "production") validated = validateLoc(currentLoc, singleAsset, assetList);
            else validated = { site: site.physical_site_name, site_loc: defaultIP.site_loc }; //if job site is not production (ie. no ip should exist) then set site_loc fields to empty
            if (typeof validated === "string") {
                window.alert(validated);
            } else {
                if (window.confirm(`Are you sure you wish to move this asset to ${formatLoc()}?`)) {
                    setToggleBtn(false); //set to loading screen
                    async function postNewLocData() {
                        const action_date = new Date();
                        const newHistoryKey = generateHistoryKey();
                        setLocUpdatedSuccess(await updateAsset(
                            singleAsset.asset_id,
                            {
                                ...singleAsset,
                                location: validated,
                                status: setStatus(),
                                history: [
                                    ...singleAsset.history,
                                    {
                                        action_date: JSON.stringify(action_date),
                                        action_taken: "Move Asset",
                                        action_by: accountLogged.name,
                                        action_by_id: accountLogged.user_id,
                                        action_key: newHistoryKey,
                                        action_comment: "Move Asset Details"
                                    },
                                ],
                            }));
                    }
                    if(setLocUpdatedSuccess) window.location.reload();
                    postNewLocData();
                }
            }
        } else window.alert("You must select a valid job site to move to!");
    };

    useEffect(() => {
        if (locUpdatedSuccess && !locUpdatedSuccess.error) {
            setToggleBtn(true); //toggle loading spinner
            setMoveSuccessful(true); //toggle success message
            // window.location.reload(); //reload component so single asset info is updated with new data
        }
    }, [locUpdatedSuccess]);

    return (
        <div>
            {jobSites && assetList && toggleBtn ?
                <form id="move-asset-form" className="upload-container" onSubmit={submitHandler}>
                    <h3>Current Device Location: <span>{formatLocLabel()}</span></h3>
                    {activeJobsiteCount >= 1 ? 
                        <>
                    <div className='move-input-container'>

                        <select onChange={changeHandler} defaultValue={selectedSite}>
                            <option>-- Select Site --</option>
                            {jobSites.map((js, key) => {
                                return js.status === "Active" && <option key={key} value={js.physical_site_name}>{js.physical_site_name}</option>
                            })}
                        </select>
                        {site && site.category === "production" && currentLoc &&
                            <div className='ip-inputs'> -
                                <input type="text" id="first_octet" defaultValue={site.first_octet || ''} readOnly maxLength="2" />.
                                <input type="text" id="mdc" value={currentLoc.site_loc.mdc || ''} onChange={changeIPHandler} maxLength="2" /> .
                                <input type="text" id="shelf" value={currentLoc.site_loc.shelf || ''} onChange={changeIPHandler} maxLength="2" /> .
                                <input type="text" id="unit" value={currentLoc.site_loc.unit || ''} onChange={changeIPHandler} maxLength="2" />
                            </div>}
                    </div>
                    {moveSuccessful && locUpdatedSuccess && <div className='move-success'>{locUpdatedSuccess.data.category === "production" ? <p style={{ color: colorCodes["Active"] }}>Move to {locUpdatedSuccess.data.location.site} - {locUpdatedSuccess.data.location.site_loc.first_octet}.{locUpdatedSuccess.data.location.site_loc.mdc}.{locUpdatedSuccess.data.location.site_loc.shelf}.{locUpdatedSuccess.data.location.site_loc.unit} - Successful!</p> : <p style={{ color: colorCodes["Active"] }} >Move to {locUpdatedSuccess.data.location.site} Successful!</p>}</div>}
                    <button className="submit-move-btn" type="submit" form='move-asset-form'>
                        Move Asset
                    </button>
                    <button className="submit-move-btn">
                        Cancel
                    </button>
                    </> : <p>There are no currently active job sites!</p>}
                </form> : <LoaderSpinner height={45} width={45} message={"Data"} />}
        </div>
    );
}

export default SingleAssetMove;