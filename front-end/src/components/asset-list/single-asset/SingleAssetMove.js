import { useEffect, useState } from 'react';
import './SingleAssetMove.css';

//utils
import { getJobSites, getAllAssets } from '../../../utils/api';
import LoaderSpinner from '../../LoaderSpinner';
import validateLoc from '../../../utils/validation/validateLoc';
import { updateAsset } from '../../../utils/api';
import colorCodes from '../../../utils/colorCodes';

function SingleAssetMove({ singleAsset, accountLogged }){
    const [jobSites, setJobSites] = useState(); //fetch all job sites
    const [assetList, setAssetList] = useState();
    const [selectedSite, setSelectedSite] = useState(); //selected site name from drop down
    const [site, setSite] = useState();
    const defaultIP = { site: '', site_loc: { first_octet: '', mdc: '', shelf: '', unit: '' }};
    const [currentLoc, setCurrentLoc] = useState(defaultIP);
    const [locUpdatedSuccess, setLocUpdatedSuccess] = useState(null);
    const [toggleBtn, setToggleBtn] = useState(true);
    const [moveSuccessful, setMoveSuccessful] = useState(false);

    useEffect(() => {
        async function getAllSites(){
            setJobSites(await getJobSites());
        }
        getAllSites();
        setSelectedSite(singleAsset[0].location.site)
    }, []);

    useEffect(() => {
        async function getAssets(){
            setAssetList(await getAllAssets());
        }
        getAssets();
    }, []);

    const changeHandler = (e) => {
        e.preventDefault();
        setSelectedSite(e.currentTarget.value);
    };

    useEffect(() => {
        if(selectedSite) setCurrentLoc({ ...currentLoc, site: selectedSite });
    }, [selectedSite, setSelectedSite]);

    const changeIPHandler = (e) => {
        e.preventDefault();
        const { id, value } = e.currentTarget;
        setCurrentLoc({ ...currentLoc, ["site_loc"]: {...currentLoc.site_loc, [id]: value}});
    };

    useEffect(() => {
        if(jobSites && selectedSite) setSite(jobSites.find(site => site.physical_site_name === selectedSite));
    }, [jobSites, setJobSites, selectedSite, setSelectedSite]);

    useEffect(() => {
        //if the site is production and matches the site the singleAsset belongs to, fill the form fields with existing location data
        if((site && site.category === "production" && singleAsset[0]) && site.physical_site_name === singleAsset[0].location.site) setCurrentLoc({ site: site.physical_site_name, site_loc: { first_octet: site.first_octet, mdc: singleAsset[0].location.site_loc.mdc, shelf: singleAsset[0].location.site_loc.shelf, unit: singleAsset[0].location.site_loc.unit}})
        else setCurrentLoc({...defaultIP, site: selectedSite }); //otherwise clear the current working IP
    }, [site, setSite]);

    const submitHandler = (e) => {
        //validate location
        e.preventDefault();
        setMoveSuccessful(false); //move is not successful yet
        //returns object if location is valid, or error string
        const validated = validateLoc(currentLoc, singleAsset, assetList);
        if(typeof validated === "string"){
            window.alert(validated);
        }else 
    {
        console.log('validated and lets move!');
        setToggleBtn(false); //set to loading screen
        async function postNewLocData(){
            setLocUpdatedSuccess(await updateAsset(singleAsset[0].asset_id, {...singleAsset[0], location: validated }));
        }
        postNewLocData();
    }
    };

    useEffect(() => {  
        if(locUpdatedSuccess && !locUpdatedSuccess.error){
            setToggleBtn(true);
            setMoveSuccessful(true);
            window.location.reload();
        }
    }, [locUpdatedSuccess]);

    console.log(locUpdatedSuccess);
    return (
        <div>
            {jobSites && assetList && toggleBtn ? 
            <form id="move-asset-form" className="upload-container" onSubmit={submitHandler}>
                <h3>Current Device Location: {singleAsset[0].location.site} - {singleAsset[0].location.site_loc.first_octet}.{singleAsset[0].location.site_loc.mdc}.{singleAsset[0].location.site_loc.shelf}.{singleAsset[0].location.site_loc.unit}</h3>
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
                {moveSuccessful && locUpdatedSuccess && <div className='move-success'><p style={{color: colorCodes["Active"]}}>Move to  - {locUpdatedSuccess.data.location.site_loc.first_octet}.{locUpdatedSuccess.data.location.site_loc.mdc}.{locUpdatedSuccess.data.location.site_loc.shelf}.{locUpdatedSuccess.data.location.site_loc.unit} - Successful!</p></div>}
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