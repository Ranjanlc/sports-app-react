import { useState } from 'react';
import datePicker, { apiDateConverter } from '../../helpers/date-picker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import classes from './DateList.module.css';
import liveicon from '../../assets/scoreList/liveicon.png';
import { NavLink, useNavigate } from 'react-router-dom';

const DateList = ({ dateId, setDateHandler, date, sportName }) => {
  console.log(dateId, date, sportName);
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(
    dateId ? new Date(dateId) : new Date()
  );
  const [dateNotClicked, setDateNotClicked] = useState(true);
  const curDay = apiDateConverter(new Date());
  const changeStateHandler = (date) => {
    setDateHandler(date);
    setDateNotClicked(false);
    setStartDate(new Date(date));
  };
  const dateContainer = datePicker(date);
  const dateList = dateContainer?.map((date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const convertedDate = apiDateConverter(date);
    if (!dateId && convertedDate === curDay && dateNotClicked) {
      return (
        <NavLink
          key={date?.toISOString()}
          className={({ isActive }) =>
            [
              dateNotClicked ? classes.active : null,
              isActive ? classes.active : null,
            ]
              .filter(Boolean)
              .join(' ')
          }
          onClick={changeStateHandler.bind(null, convertedDate)}
          to={`/${sportName}/${convertedDate}`}
        >
          <span>{day}</span>
          <span>{month}</span>
        </NavLink>
      );
    }
    return (
      <NavLink
        key={date?.toISOString()}
        className={({ isActive }) => (isActive ? classes.active : '')}
        onClick={changeStateHandler.bind(null, convertedDate)}
        to={`/${sportName}/${convertedDate}`}
      >
        <span>{day}</span>
        <span>{month}</span>
      </NavLink>
    );
  });
  const dateChangeHandler = (dateValue) => {
    const convertedDate = apiDateConverter(dateValue);
    setDateHandler(convertedDate);
    setStartDate(dateValue);
    navigate(`/${sportName}/${convertedDate}`);
  };
  const liveClickHandler = (e) => {
    navigate(`/${sportName}/live`);
  };
  return (
    <ul className={classes.date}>
      <img
        src={liveicon}
        className={classes.icon}
        onClick={liveClickHandler}
        alt="Live icon"
      />
      <li className={classes['date-container']}>{dateList}</li>
      <li className={classes['date-picker__container']}>
        <DatePicker
          // Conditional selector to display placeHolder text on initial loading
          selected={dateId ? startDate : null}
          className={classes['date-picker']}
          todayButton="Set to Today"
          closeOnScroll={true}
          placeholderText="mm/dd/yy&#8617;"
          value={startDate}
          // To disable keyboard
          onFocus={(e) => e.target.blur()}
          onChange={dateChangeHandler}
        />
      </li>
    </ul>
  );
};
export default DateList;
