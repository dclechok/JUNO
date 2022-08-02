import { useEffect, useState } from 'react';
import BulkUpload from './BulkUpload.js';
import SingleUpload from './SingleUpload.js';

function UploadAssets({ assetList, setLoadAssets, loadAssets, accountLogged }){

    const [toggleUpload, setToggleUpload] = useState('');
    const defaultButtonState = { 
      singleUpload: "button-link",
      bulkUpload: "button-link"
    };
    const [buttonState, setButtonState] = useState(defaultButtonState);

    const onClickHandler = (e) => {
        const { id = '' } = e.currentTarget;
        setButtonState({...defaultButtonState, [id]: "active-button-link"});
        setToggleUpload(id);
    };

    useEffect(() => {
      setButtonState({...defaultButtonState, bulkUpload: "active-button-link"})
      setToggleUpload("bulkUpload");
    }, []);

    return(
    <div className="single-asset-render admin-panel-container">
      <h1>Upload Assets</h1>
      <header className="single-asset-header container-style center-header">
          <div>
            <span style={{color: "black"}}>[<button className={buttonState.bulkUpload} id="bulkUpload" onClick={onClickHandler}>Bulk Asset Upload</button>]</span>&nbsp;
          </div>
          <div>
          <span style={{color: "black"}}>[<button className={buttonState.singleUpload} id="singleUpload" onClick={onClickHandler}>Single Asset Upload</button>]</span>
          </div>
        </header>

        {toggleUpload === 'bulkUpload' && <BulkUpload assetList={assetList} setLoadAssets={setLoadAssets} loadAssets={loadAssets} accountLogged={accountLogged} />}
        {toggleUpload === 'singleUpload' && <SingleUpload assetList={assetList} setLoadAssets={setLoadAssets} loadAssets={loadAssets} accountLogged={accountLogged} />}
        </div>
      )
}

export default UploadAssets;