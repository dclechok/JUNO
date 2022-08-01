import { useState, useEffect } from "react";

import LoaderSpinner from '../LoaderSpinner';
//utils
import dateFormatter from "../../utils/dateFormatter";
import { getUser, listHistoryByUserID } from "../../utils/api";
import colorCodes from '../../utils/calculateValues'

function UserPanel({ accountLogged }) {
  const [userDetails, setUserDetails] = useState(null);
  const [userHistory, setUserHistory] = useState(null);

  useEffect(() => {
    async function getUserDetails() {
      setUserDetails(await getUser(accountLogged.account[0].user_id));
    }
    getUserDetails();
  }, []);

  useEffect(() => {
    async function gatherHistory(){
        setUserHistory(await listHistoryByUserID(accountLogged.account[0].user_id));
    }
    gatherHistory();
  }, []);

  const onClickHandler = (e) => {
    console.log(e.currentTarget);
  };

  return (
    <div className="single-asset-render">
      <h1>User Panel</h1>
      {(userDetails && userHistory) ? 
      <>
      <header className="single-asset-header container-style center-header">
      <table className="history-table">
        <tbody>
          <tr>
            <td>
              <b>User ID</b>
            </td>
            <td>{userDetails.user_id}</td>
          </tr>
          <tr>
            <td>
              <b>Username</b>
            </td>
            <td>{userDetails.username}</td>
          </tr>
          <tr>
            <td>
              <b>Access Level</b>
            </td>
            <td>{userDetails.access_level}</td>
          </tr>
          <tr>
            <td>
              <b>Password</b>
            </td>
            <td><span style={{color: "black"}}>[<button className="button-link">Change Password</button>]</span></td>
          </tr>
          <tr>
            <td>
              <b>Email</b>
            </td>
            <td>{userDetails.email}</td>
          </tr>
          <tr>
            <td>
              <b>Created Date</b>
            </td>
            <td>{dateFormatter(userDetails.created_at)}</td>
          </tr>
          <tr>
            <td>
              <b>Created By</b>
            </td>
            <td>{userDetails.history.map(uHist => {
            if(uHist.action_taken === "Create User") return uHist.action_by})}</td>
          </tr>
        </tbody>
      </table>
      </header>
      <section className="container-style management-body">
      <h3>User History</h3>
      <table className="history-table">
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
                  <b>View</b>
                </th>
              </tr>
              {userHistory
                  .sort((a, b) =>
                    b.logged_date
                      .toString()
                      .localeCompare(a.logged_date.toString())
                  )
                  .map((history, key) => {
                    return (
                      <tr key={`row ${key}`}>
                        <td>{dateFormatter(history.logged_date)}</td>
                        <td>
                          <span
                            style={{
                              color: colorCodes[history.logged_action],
                            }}
                          >
                            {history.logged_action}
                          </span>
                        </td>
                        <td>{history.logged_by}</td>
                        <td>
                          <span style={{color: "black"}}>[<button className="button-link" id={history.history_key} value={history.logged_action} onClick={onClickHandler}>View</button>]</span>
                        </td>
                      </tr>
                    );
                  })
                }
            </tbody>
          </table>
      </section>
      </> : <LoaderSpinner height={45} width={45} message={"User Details"} />}
    </div>
  );
}

export default UserPanel;
