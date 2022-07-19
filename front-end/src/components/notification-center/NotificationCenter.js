import "./NotificationCenter.css";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getHistory } from "../../utils/api";
//utils
import colorCode from "../../utils/colorCodes";

function NotificationCenter({ assetList }) {
  /*
  Sort asset list by latest history, and grab the top 5 for notification center.
                action_date: action_date,
                action_taken: "Bulk Uploaded",
                action_by: "dclechok",
                action_comment: "",
  */

 //types of moves: "bulk uploaded", "single upload", "delete asset", "move asset", "edit asset", etc

  const [latestHistory, setLatestHistory] = useState([]);
  const navigate = new useNavigate();

  useEffect(() => {
    const abortController = new AbortController();
    async function fetchHistory(){
      setLatestHistory(await getHistory());
    }
    fetchHistory();
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    if(latestHistory && latestHistory.length !== 0) setLatestHistory(latestHistory.sort((a, b) => {
      return new Date(b.logged_date) - new Date(a.logged_date);
    }).filter((val, key) => {
      return key <= 5 // limit the amount that renders on latest notifications
    }));
  }, []);

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
        {latestHistory && latestHistory.length !== 0 && latestHistory.sort((a, b) => {
      return new Date(b.logged_date) - new Date(a.logged_date);
    }).filter((val, key) => {
      return key <= 5 // limit the amount that renders on latest notifications
    }).map((entry, key) => 
          {
            return (
            <p key={key}>{reformatDate(entry.logged_date)} <span style={{color: colorCode[entry.logged_action]}} >{`${entry.logged_action}`}</span>{` by ${entry.logged_by}`}</p>
          )}
        )}
        <hr/>
        <span style={{color: "black"}}>[<button className="button-link" onClick={handleClick}>View All</button>]</span>
      </div>
      
    </section>
  );
}

export default NotificationCenter;
