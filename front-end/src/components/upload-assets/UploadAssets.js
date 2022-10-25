import { useEffect, useState } from 'react';
import BulkUpload from './BulkUpload.js';
import SingleUpload from './SingleUpload.js';

function UploadAssets({ accountLogged }) {

  const [toggleUpload, setToggleUpload] = useState('');

  const handleSelect = (e) => {
    const { value } = e.currentTarget;
    setToggleUpload(value);
  };

  return (
    <div className="upload-container">
      <h1>Upload Assets</h1>
      <select onChange={handleSelect}>
        <option value="bulkUpload">Bulk Upload</option>
        <option value="singleUpload">Single Upload</option>
      </select>
      {toggleUpload === 'bulkUpload' && <BulkUpload accountLogged={accountLogged} />}
      {toggleUpload === 'singleUpload' && <SingleUpload accountLogged={accountLogged} />}
    </div>
  )
}

export default UploadAssets;