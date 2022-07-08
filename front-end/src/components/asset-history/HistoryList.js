import "./HistoryList.css";
import { useState, useEffect } from "react";

//components
import HistorySearch from "./HistorySearch";

//utils
import dateFormatter from "../../utils/dateFormatter";

//renders a lot of all historical data in order from oldest to newest history
function HistoryList({ assetList }) {
  const colorCode = {
    "Bulk Upload": "rgb(110, 236, 236)",
    "Single Upload": "rgb(110, 190, 236)",
    "Delete Asset": "rgb(236, 125, 110)",
    "Move Asset": "rgb(110, 164, 236)",
    "Edit Asset": "rgb(205, 214, 126)",
  };

  const [daysSelected, setDaysSelected] = useState(null);
  const [dateFilteredList, setDateFilteredList] = useState(assetList);
  const [dayOrRange, setDayOrRange] = useState("");
  const [radioCheck, setRadioCheck] = useState(true);

  const filterDate = (daysSelected) => {
    if (dayOrRange === "day") {
      //filter by date
      const formattedDay = `${daysSelected.month}/${daysSelected.day}/${daysSelected.year}`;
      setDateFilteredList(
        assetList.filter((asset) => {
          console.log(asset.history);
          const timestamp = new Date(asset.history.action_date); //get from asset itself
          const formattedTimestamp = `${
            timestamp.getMonth() + 1
          }/${timestamp.getDate()}/${timestamp.getFullYear()}`;
          if (formattedTimestamp === formattedDay) return asset;
        })
      );
    } else if (dayOrRange === "range") {
      if (daysSelected.from && daysSelected.to) {
        //filter by date range
        const formattedFrom = `${daysSelected.from.month}/${daysSelected.from.day}/${daysSelected.from.year}`;
        const formattedTo = `${daysSelected.to.month}/${daysSelected.to.day}/${daysSelected.to.year}`;
        setDateFilteredList(
          assetList.filter((asset) => {
            const timestamp = new Date(asset.history.action_date); //get from asset itself
            const formattedTimestamp = `${
              timestamp.getMonth() + 1
            }/${timestamp.getDate()}/${timestamp.getFullYear()}`;
            if (
              Date.parse(formattedTimestamp) >= Date.parse(formattedFrom) &&
              Date.parse(formattedTimestamp) <= Date.parse(formattedTo)
            )
              return asset;
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
          />
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
                  <b>Comments</b>
                </th>
                <th>
                  <b>View</b>
                </th>
              </tr>
              {dateFilteredList &&
                dateFilteredList
                  .sort((a, b) =>
                    b.history.action_date
                      .toString()
                      .localeCompare(a.history.action_date.toString())
                  )
                  .map((asset, key) => {
                    return (
                      <tr key={`row ${key}`}>
                        <td>{dateFormatter(asset.history.action_date)}</td>
                        <td>
                          <span
                            style={{
                              color: colorCode[asset.history.action_taken],
                            }}
                          >
                            {asset.history.action_taken}
                          </span>
                        </td>
                        <td>{asset.history.action_by}</td>
                        <td>{asset.history.action_comment}</td>
                        <td>
                          <a href="http://google.com">View</a>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </>
    </div>
  );
}

export default HistoryList;
