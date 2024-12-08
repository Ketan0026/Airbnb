import React, { useContext, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./DatePicker.css";
import { UserContext } from "../../UserContext";

const DatePicker = ({ onDateChange }) => {
  const { windowWidth } = useContext(UserContext);
  const today = new Date();
  const [date, setDate] = useState([
    {
      startDate: today,
      endDate: today,
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    const selectedRange = ranges.selection;
    setDate([selectedRange]);
    onDateChange(selectedRange.startDate, selectedRange.endDate);
  };

  return (
    <>
      <div className="dateContainer rounded-custom bg-white md:shadow-focus-bs">
        <DateRangePicker
          onChange={handleSelect}
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          months={windowWidth < 768 ? 1 : 2}
          ranges={date}
          direction="horizontal"
          minDate={today}
        />
      </div>
    </>
  );
};

export default DatePicker;