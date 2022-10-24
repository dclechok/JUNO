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

    const handleSelect = (e) => {
        const { value } = e.currentTarget;
        console.log(value);
        setToggleUpload(value);
    };

    useEffect(() => {
      const abortController = new AbortController();
      setButtonState({...defaultButtonState, bulkUpload: "active-button-link"})
      setToggleUpload("bulkUpload");
      return () => abortController.abort();
    }, []);

    return(
    <div className="upload-container">
      <h1>Upload Assets</h1>
      <select onChange={handleSelect}>
        <option value="bulkUpload">Bulk Upload</option>
        <option value="singleUpload">Single Upload</option>
      </select>

        {toggleUpload === 'bulkUpload' && <BulkUpload setLoadAssets={setLoadAssets} loadAssets={loadAssets} accountLogged={accountLogged} />}
        {toggleUpload === 'singleUpload' && <SingleUpload setLoadAssets={setLoadAssets} loadAssets={loadAssets} accountLogged={accountLogged} />}
        </div>
      )
}

export default UploadAssets;