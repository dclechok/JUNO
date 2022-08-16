import "./HistoryList.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//components
import HistorySearch from "./HistorySearch";
import LoaderSpinner from "../LoaderSpinner";

//utils
import dateFormatter from "../../utils/dateFormatter.js";
import { getHistory } from "../../utils/api.js";
import colorCode from "../../utils/colorCodes";
import listPages from "../../utils/listPages";

//images
import scrollLeft from "../../images/scroll-left-icon.png";
import scrollRight from "../../images/scroll-right-icon.png";

//renders a lot of all historical data in order from oldest to newest history
function HistoryList({
  resetDatePicker,
  setResetDatePicker,
  setSearchHistoryType,
}) {
  const navigate = new useNavigate();
  const MAX_ENTRIES_PER_PAGE = 500;
  const [historyList, setHistoryList] = useState(null); //where we will fetch History data and store here.
  const [daysSelected, setDaysSelected] = useState(null);
  const [dateFilteredList, setDateFilteredList] = useState(historyList);
  const [dayOrRange, setDayOrRange] = useState("");
  const [radioCheck, setRadioCheck] = useState(true);
  const [entriesPerPage, setEntriesPerPage] = useState(MAX_ENTRIES_PER_PAGE);
  const [pageNum, setPageNum] = useState(1); //starting page number

  //load our general history table
  useEffect(() => {
    const abortController = new AbortController();
    async function loadHistoryList() {
      const abortController = new AbortController();
      setHistoryList(await getHistory());
      return abortController.abort();
    }
    loadHistoryList();
    return () => abortController.abort();
  }, [resetDatePicker, setResetDatePicker]);

  //set our filtered list to default history list
  useEffect(() => {
    const abortController = new AbortController();
    if (historyList) setDateFilteredList(historyList);
    return () => abortController.abort();
  }, [historyList, setHistoryList, entriesPerPage, setEntriesPerPage, setResetDatePicker, resetDatePicker]);

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
    const abortController = new AbortController();
    if (daysSelected && Object.keys(daysSelected).includes("day")) {
      //sort by day
      setDayOrRange("day");
      filterDate(daysSelected);
    } else if (daysSelected && Object.keys(daysSelected).includes("from")) {
      // sort by day range
      setDayOrRange("range");
      filterDate(daysSelected);
    }
    return () => abortController.abort();
  }, [daysSelected, setDaysSelected, dayOrRange]);

  const onClickHandler = (e) => {
    e.preventDefault();
    const { id = "", value } = e.currentTarget;
    setSearchHistoryType(value);
    if (id) navigate(`/history/${id}`);
  };

  const changeResultsPerPage = (e) => {
    if(e.currentTarget.id === "reset-results-per") setEntriesPerPage(MAX_ENTRIES_PER_PAGE);
    if(e.currentTarget.value >= 1 && e.currentTarget.value <= 500) setEntriesPerPage(e.currentTarget.value);
  };

  const handleScroll = (e) => {
    const { id } = e.currentTarget;
    if(id === 'scroll-left' && pageNum >= 2 ) setPageNum(Number(pageNum) - 1);
    if(id === 'scroll-right' && pageNum <= Math.ceil((historyList.length / MAX_ENTRIES_PER_PAGE) - 1)) setPageNum(Number(pageNum) + 1);
  };

  const handleSelect = (e) => {
    const { value } = e.currentTarget;
    setPageNum(value);
  };

  console.log(pageNum)
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
          {dateFilteredList && dateFilteredList.length !== 0 ? (
            <>
              <div className="history-pages">
                <div>
                  <input
                    type="text"
                    id="results-per-page"
                    value={entriesPerPage}
                    onChange={changeResultsPerPage}
                  />
                  <label htmlFor="results-per-page"> Results Per Page</label>
                  &nbsp;
                  <span style={{ color: "black" }}>
                    [
                    <button
                      className="button-link"
                      onClick={changeResultsPerPage}
                      id="reset-results-per"
                    >
                      Reset
                    </button>
                    ]
                  </span>
                </div>
                <div className="history-page-selector">
                  <button
                    className="image-button"
                    id="scroll-left"
                    onClick={handleScroll}
                  >
                    <img src={scrollLeft} />
                  </button>
                  {historyList && (
                    <select
                      className="page-numbers"
                      value={pageNum}
                      onChange={handleSelect}
                    >
                      {Array.from(
                        Array(
                          Math.ceil(dateFilteredList.length / MAX_ENTRIES_PER_PAGE)
                        )
                      ).map((page, key) => {
                        return <option key={key + 1}>{key + 1}</option>;
                      })}
                    </select>
                  )}
                  <p className="page-num-height">
                    /{Math.ceil(dateFilteredList.length / MAX_ENTRIES_PER_PAGE)}
                  </p>
                  <button
                    className="image-button"
                    id="scroll-right"
                    onClick={handleScroll}
                  >
                    <img src={scrollRight} />
                  </button>
                </div>
              </div>
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
                    listPages(dateFilteredList, pageNum, entriesPerPage) &&
                    listPages(dateFilteredList, pageNum, entriesPerPage).sort(
                      (a, b) => {
                        const aTime = new Date(a.logged_date);
                        const bTime = new Date(b.logged_date);
                        return bTime - aTime;
                      })
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
                              <span style={{ color: "black" }}>
                                [
                                <button
                                  className="button-link"
                                  id={history.history_key}
                                  value={history.logged_action}
                                  onClick={onClickHandler}
                                >
                                  View
                                </button>
                                ]
                              </span>
                            </td>
                          </tr>
                        )
                       })
                   }
                </tbody>
              </table>{" "}
            </>
          ) : (
            <div className="no-entries"><h3>No entries on this date!</h3></div>
          )}
        </div>
      </>
    </div>
  );
}

export default HistoryList;
