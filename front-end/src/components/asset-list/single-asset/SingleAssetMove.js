import { useEffect, useState } from 'react';
import './SingleAssetMove.css';
import { getJobSites } from '../../../utils/api';
import LoaderSpinner from '../../LoaderSpinner';


function SingleAssetMove({ singleAsset, accountLogged }){
    const [jobSites, setJobSites] = useState(); //fetch all job sites
    const [selectedSite, setSelectedSite] = useState(); //selected site name from drop down
    const [site, setSite] = useState();
    const defaultIP = { first_octet: '', mdc: '', shelf: '', unit: '' };
    const [currentIP, setCurrentIP] = useState(defaultIP);

    useEffect(() => {
        async function getAllSites(){
            setJobSites(await getJobSites());
        }
        getAllSites();
        setSelectedSite(singleAsset[0].location.site)
    }, []);

    const changeHandler = (e) => {
        e.preventDefault();
        setSelectedSite(e.currentTarget.value);
    };

    const changeIPHandler = (e) => {
        e.preventDefault();
        const { id, value } = e.currentTarget;
        setCurrentIP({ ...currentIP, [id]: value });
    };

    useEffect(() => {
        if(jobSites && selectedSite) setSite(jobSites.find(site => site.physical_site_name === selectedSite));
    }, [jobSites, setJobSites, selectedSite, setSelectedSite]);

    useEffect(() => {
        //if the site is production and matches the site the singleAsset belongs to, fill the form fields with existing location data
        if((site && site.category === "production" && singleAsset[0]) && site.physical_site_name === singleAsset[0].location.site) setCurrentIP({ first_octet: site.first_octet, mdc: singleAsset[0].location.site_loc.mdc, shelf: singleAsset[0].location.site_loc.shelf, unit: singleAsset[0].location.site_loc.unit})
        else setCurrentIP(defaultIP); //otherwise clear the current working IP
    }, [site, setSite]);

    return (
        <div>
            {jobSites ? 
            <form className="upload-container">
                <h3>Current Device Location: {singleAsset[0].location.site} - {singleAsset[0].location.site_loc.first_octet}.{singleAsset[0].location.site_loc.mdc}.{singleAsset[0].location.site_loc.shelf}.{singleAsset[0].location.site_loc.unit}</h3>
                <div className='move-input-container'>
                <select onChange={changeHandler} defaultValue={selectedSite}>
                    {jobSites.map((js, key) => {
                        return <option key={key} value={js.physical_site_name}>{js.physical_site_name}</option>
                    })}
                </select>
                {site && site.category === "production" &&
                <div className='ip-inputs'> - 
                <input type="text" id="first_octet" defaultValue={site.first_octet} readOnly maxLength="2" />.
                <input type="text" id="mdc" value={currentIP.mdc} onChange={changeIPHandler} maxLength="2" /> . 
                <input type="text" id="shelf" value={currentIP.shelf} onChange={changeIPHandler} maxLength="2" /> . 
                <input type="text" id="unit" value={currentIP.unit} onChange={changeIPHandler} maxLength="2" />
                </div>}
                </div>
                <button className="submit-move-btn">
                  Move Asset
                </button>
                <button className="submit-move-btn">
                  Cancel
                </button>
            </form> : <LoaderSpinner height={45} width={45} message={"Job Sites"} />}
        </div>
    );
}

export default SingleAssetMove;