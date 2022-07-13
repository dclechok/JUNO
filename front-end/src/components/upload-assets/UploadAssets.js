import './UploadAssets.css';
import { useState } from 'react';
import BulkUpload from './BulkUpload.js';
import SingleUpload from './SingleUpload.js';

function UploadAssets({ assetList, setLoadAssets, loadAssets }){

    const [toggleUpload, setToggleUpload] = useState('');
    const defaultButtonState = { 
      singleUpload: "button-link button-link-font",
      bulkUpload: "button-link button-link-font"
    };
    const [buttonState, setButtonState] = useState(defaultButtonState);

    const onClickHandler = (e) => {
        const { id = '' } = e.currentTarget;
        setButtonState({...defaultButtonState, [id]: "active-button-link button-link-font"});
        setToggleUpload(id);
    };

    return(
    <div className="single-asset-render">
      <h1>Upload Assets</h1>
        <header className="upload-options">
          <div>
            <h2>[<button className={buttonState.bulkUpload} id="bulkUpload" onClick={onClickHandler}>Bulk Asset Upload</button>]</h2>
          </div>
          <div>
            <h2>[<button className={buttonState.singleUpload} id="singleUpload" onClick={onClickHandler}>Single Asset Upload</button>]</h2>
          </div>
        </header>

        {toggleUpload === 'bulkUpload' && <BulkUpload assetList={assetList} setLoadAssets={setLoadAssets} loadAssets={loadAssets} />}
        {toggleUpload === 'singleUpload' && <SingleUpload assetList={assetList} setLoadAssets={setLoadAssets} loadAssets={loadAssets} />}
        </div>
      )
}

export default UploadAssets;