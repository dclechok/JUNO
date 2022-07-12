import './UploadAssets.css';
import { useState } from 'react';
import BulkUpload from './BulkUpload.js';
import SingleUpload from './SingleUpload.js';

function UploadAssets({ assetList, setLoadAssets, loadAssets }){

    const [toggleUpload, setToggleUpload] = useState('');

    const onClickHandler = (e) => {
        const { id = '' } = e.currentTarget;
        setToggleUpload(id);
    };

    return(
    <div className="single-asset-render">
      <h1>Upload Assets</h1>
        <header className="upload-options">
          <div>
            <h2>[<button id="bulk-upload" onClick={onClickHandler}>Bulk Asset Upload</button>]</h2>
          </div>
          <div>
            <h2>[<button id="single-upload" onClick={onClickHandler}>Single Asset Upload</button>]</h2>
          </div>
        </header>

        {toggleUpload === 'bulk-upload' && <BulkUpload assetList={assetList} setLoadAssets={setLoadAssets} loadAssets={loadAssets} />}
        {toggleUpload === 'single-upload' && <SingleUpload assetList={assetList} setLoadAssets={setLoadAssets} loadAssets={loadAssets} />}
        </div>
      )
}

export default UploadAssets;