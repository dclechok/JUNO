import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './UserPanel.css';

import LoaderSpinner from '../LoaderSpinner';
//utils
import dateFormatter from "../../utils/dateFormatter";
import { getUser, listHistoryByUserID } from "../../utils/api";
import colorCode from '../../utils/colorCodes';

function UserPanel({ accountLogged }) {
  const [userDetails, setUserDetails] = useState(null);
  const [userHistory, setUserHistory] = useState(null);
  const [changePassword, setChangePassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => { //get this users specific details
    async function getUserDetails() {
      setUserDetails(await getUser(accountLogged.account[0].user_id));
    }
    getUserDetails();
  }, []);

  useEffect(() => {
    async function gatherHistory(){ //get all users related to our user
        setUserHistory(await listHistoryByUserID(accountLogged.account[0].user_id));
    }
    gatherHistory();
  }, []);

  const clickHistoryHandler = (e) => { //navigate to individual history log
    const { id } = e.currentTarget;
    navigate(`/history/${id}`);
  };

  const handleChangePassword = (e) => { //start change password form
    const { id } = e.currentTarget;
    if(id === "change-pass") setChangePassword(true);
  };

  const cancelChangePasswordHandler = (e) => { //cancel change password form
    const { id } = e.currentTarget;
    if(id === "cancel-change-password") setChangePassword(false);
  };

  const changePasswordHandler = (e) => { //submit password change
    const { id } = e.currentTarget;
    if(id === "submit-pw-change"){

    }
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
            <td>{!changePassword ? <span style={{color: "black"}}> [<button className="button-link" onClick={handleChangePassword} id="change-pass">Change Password</button>]</span> : 

            <form className="form-container" onSubmit={changePasswordHandler} >
                <label htmlFor="old-pass">Old Password</label>
                <input id="old-pass" type="text" />
                <label htmlFor="new-pass1">New Password</label>
                <input id="new-pass1" type="text" />
                <label htmlFor="new-pass2">New Password</label>
                <input id="new-pass2" type="text" />
                <div className="change-pass-btn-container fix-button">
                <span style={{color: "black"}}>[<button type="submit" id="submit-pw-change" className="button-link password-change-btn">Submit</button>]&nbsp;[<button className="button-link" id="cancel-change-password" onClick={cancelChangePasswordHandler} >Cancel</button>]</span>
                </div>
            </form>

            }</td>
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
                              color: colorCode[history.logged_action],
                            }}
                          >
                            {history.logged_action}
                          </span>
                        </td>
                        <td>{history.logged_by}</td>
                        <td>
                          <span style={{color: "black"}}>[<button className="button-link" id={history.history_key} value={history.logged_action} onClick={clickHistoryHandler}>View</button>]</span>
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
