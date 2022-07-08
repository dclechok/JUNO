import "./HistorySearch.css";

import '@amir04lm26/react-modern-calendar-date-picker/lib/DatePicker.css';
import DatePicker from '@amir04lm26/react-modern-calendar-date-picker';
import { useState, useEffect } from "react";

function HistorySearch({ daysSelected, setDaysSelected, radioCheck, setRadioCheck }) {
 

  const handleSubmit = (e) => {
    e.preventDefault(); //stop page from reload
  };

  const handleRadioChange = (e) => {
    //alternate between radio buttons
    setRadioCheck(!radioCheck);
    const { id } = e.currentTarget;
    if(id === "byDateRange") setDaysSelected({
      from: null,
      to: null
    });
    if(id === "byDate") setDaysSelected(null);
  };

  useEffect(() => {
    formatPlaceholder(); //format the day(s) selected and render what days we're searching

  }, [setRadioCheck, radioCheck, daysSelected, setDaysSelected]);

  const formatPlaceholder = (daysSelected) => {
    if(daysSelected && Object.keys(daysSelected).includes("day")){ //single day selected
      return `Viewing Date: ${daysSelected.month}/${daysSelected.day}/${daysSelected.year}`;
    }
    else if(daysSelected && Object.keys(daysSelected).includes("from")){ //range selected
      let fromDate = '', to = '', toDate = '';
      if(!Object.values(daysSelected).includes(null)) fromDate = `${daysSelected.from.month}/${daysSelected.from.day}/${daysSelected.from.year}`//build from date
      if(!Object.values(daysSelected).includes(null)) toDate = `${daysSelected.to.month}/${daysSelected.to.day}/${daysSelected.to.year}`
      if(toDate) to = 'to';
      return `${fromDate} ${to} ${toDate}`;
    }
  };

  return (
    <div className="history-search-container">
      <form onSubmit={handleSubmit}>
        <div className="history-radio-buttons">
          <label htmlFor="byDate">By Date</label>

          <input className="radio-label"
            type="radio"
            id="byDate"
            name="by-date"
            checked={radioCheck}
            onChange={handleRadioChange}
          />
          <label htmlFor="byDateRange">By Date Range</label>
          <input
          className="radio-label"
            type="radio"
            id="byDateRange"
            name="by-date-range"
            checked={!radioCheck}
            onChange={handleRadioChange}
          /><br />
        </div>
        <div className="date-picker">
          <DatePicker value={daysSelected} onChange={setDaysSelected} />
          <p className="viewing-date">{formatPlaceholder(daysSelected)}
          </p>
        </div>
      </form>
    </div>
  );
}

export default HistorySearch;
