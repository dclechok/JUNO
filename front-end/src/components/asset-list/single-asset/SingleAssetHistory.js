import "./SingleAssetHistory.css";

//controls all rendering of a single assets history

//util
import dateFormatter from "../../../utils/dateFormatter";

function SingleAssetHistory({ singleAsset }) {

  return (
    <>
      <h3>History</h3>
      {singleAsset.length !== 0 && (
        <table className="shrink-font">
          <tbody>
            <tr>
              <th>
                <b>Date of Action</b>
              </th>
              <th>
                <b>Action Taken</b>
              </th>
              <th>
                <b>Action By</b>
              </th>
              <th>
                <b>Comments</b>
              </th>
            </tr>
            {singleAsset[0].history && (
              <tr>
                <td>{dateFormatter(singleAsset[0].updated_at)}</td>
                {/* will need to be sorted by date - newest first*/}
                <td>{singleAsset[0].history.action_taken}</td>
                <td>{singleAsset[0].history.action_by}</td>
                <td>{singleAsset[0].history.action_comment}</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
}

export default SingleAssetHistory;
