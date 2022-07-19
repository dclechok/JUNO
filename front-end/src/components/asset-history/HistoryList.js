import "./HistoryList.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//components
import HistorySearch from "./HistorySearch";
import LoaderSpinner from "../LoaderSpinner";

//utils
import dateFormatter from "../../utils/dateFormatter.js";
import { getHistory } from "../../utils/api.js"
import colorCode from "../../utils/colorCodes";

//renders a lot of all historical data in order from oldest to newest history
function HistoryList({ resetDatePicker, setResetDatePicker, setSearchHistoryType }) {

  const navigate = new useNavigate();

  const [historyList, setHistoryList] = useState(null); //where we will fetch History data and store here.
  const [daysSelected, setDaysSelected] = useState(null);
  const [dateFilteredList, setDateFilteredList] = useState(historyList);
  const [dayOrRange, setDayOrRange] = useState("");
  const [radioCheck, setRadioCheck] = useState(true);

  //load our general history table
  useEffect(() => {
    async function loadHistoryList(){
      const abortController = new AbortController();
      setHistoryList(await getHistory());
      return abortController.abort();
    }
    loadHistoryList();
  }, [resetDatePicker, setResetDatePicker]);
 
  //set our filtered list to default history list
  useEffect(() => {
    if(historyList) setDateFilteredList(historyList);
  }, [historyList, setHistoryList])

  const filterDate = (daysSelected) => {
    if (dayOrRange === "day") {
      //filter by date
      const formattedDay = `${daysSelected.month}/${daysSelected.day}/${daysSelected.year}`;
      setDateFilteredList(
        historyList.filter((history) => {
          const timestamp = new Date(history.logged_date); //get from asset itself
          const formattedTimestamp = `${
            timestamp.getMonth() + 1
          }/${timestamp.getDate()}/${timestamp.getFullYear()}`;
          if (formattedTimestamp === formattedDay) return history;
        })
      );
    } else if (dayOrRange === "range") {
      if (daysSelected.from && daysSelected.to) {
        //filter by date range
        const formattedFrom = `${daysSelected.from.month}/${daysSelected.from.day}/${daysSelected.from.year}`;
        const formattedTo = `${daysSelected.to.month}/${daysSelected.to.day}/${daysSelected.to.year}`;
        setDateFilteredList(
          historyList.filter((history) => {
            const timestamp = new Date(history.logged_date); //get from asset itself
            const formattedTimestamp = `${
              timestamp.getMonth() + 1
            }/${timestamp.getDate()}/${timestamp.getFullYear()}`;
            if (
              Date.parse(formattedTimestamp) >= Date.parse(formattedFrom) &&
              Date.parse(formattedTimestamp) <= Date.parse(formattedTo)
            )
              return history;
          })
        );
      }
    }
  };

  useEffect(() => {
    //filter history list by day or day range
    if (daysSelected && Object.keys(daysSelected).includes("day")) {
      //sort by day
      setDayOrRange("day");
      filterDate(daysSelected);
    } else if (daysSelected && Object.keys(daysSelected).includes("from")) {
      // sort by day range
      setDayOrRange("range");
      filterDate(daysSelected);
    }
  }, [daysSelected, setDaysSelected, dayOrRange]);

  const onClickHandler = (e) => {
    e.preventDefault();
    const { id = '', value } = e.currentTarget;
    setSearchHistoryType(value);
    if(id) navigate(`/history/${id}`);
  };

  return (
    <div className="single-asset-render">
      <>
        <div className="history-container">
          <h1>History Log</h1>
          <HistorySearch
            daysSelected={daysSelected}
            setDaysSelected={setDaysSelected}
            radioCheck={radioCheck}
            setRadioCheck={setRadioCheck}
            setResetDatePicker={setResetDatePicker}
            resetDatePicker={resetDatePicker}
          />
          {dateFilteredList && dateFilteredList.length !== 0 ? 
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
              {dateFilteredList &&
                dateFilteredList
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
                          <span style={{color: "black"}}>[<button className="button-link" id={history.history_key} value={history.logged_action} onClick={onClickHandler}>View</button>]</span>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>: <LoaderSpinner width={45} height={45} message={"History Log"}/> }
        </div>
      </>
    </div>
  );
}

export default HistoryList;
