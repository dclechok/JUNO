import "./NotificationCenter.css";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

function NotificationCenter({ assetList }) {
  /*
  Sort asset list by latest history, and grab the top 5 for notification center.
                action_date: action_date,
                action_taken: "Bulk Uploaded",
                action_by: "dclechok",
                action_comment: "",
  */

 //types of moves: "bulk uploaded", "single upload", "delete asset", "move asset", "edit asset" 

  const colorCode = {
    'Bulk Upload': 'rgb(110, 236, 236)', 
    'Single Upload': 'rgb(110, 190, 236)',
    'Delete Asset': 'rgb(236, 125, 110)', 
    'Move Asset': 'rgb(110, 164, 236)',
    'Edit Asset': 'rgb(205, 214, 126)'
  }

  const [latestHistory, setLatestHistory] = useState([]);
  const navigate = new useNavigate();

  useEffect(() => {
    
    setLatestHistory(assetList.sort((a, b) => {
      return new Date(b.updated_at) - new Date(a.updated_at);
    }).filter((val, key) => {
      return key <= 5 // limit the amount that renders on latest notifications
    }));
  }, [assetList]);

  const handleClick = (e) => {
    e.preventDefault();
    navigate('/history');
  };

  const reformatDate = (date) => {
    const dateToReformat = new Date(date)
    return `${dateToReformat.getMonth() + 1}/${dateToReformat.getDate()}/${dateToReformat.getFullYear()}`
  };

  return (
    <section className="dashboard-notification-container">
      <div className="notification-container">
        <h1>Latest Notifications</h1>
        <hr />
        {latestHistory && latestHistory.length !== 0 && latestHistory.map((entry, key) => 
          {
            return (
            <p key={key}>{reformatDate(entry.history.action_date)} <span style={{color: colorCode[entry.history.action_taken]}} >{`${entry.history.action_taken}`}</span>{` by ${entry.history.action_by}`}</p>
          )}
        )}
        <hr/>
        [<button className="view-all-button" onClick={handleClick}>View All</button>]
      </div>
      
    </section>
  );
}

export default NotificationCenter;
