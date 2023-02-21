import classes from './Dropdown.module.css';

import React, { useState } from 'react';
function Dropdown(props) {
  const { optionSet, groupChangeHandler } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const list = optionSet.map((option) => {
    return (
      <li onClick={() => optionClickHandler(option)} key={option}>
        {option}
      </li>
    );
  });
  const selectClickHandler = (e) => {
    setIsOpen((isOpen) => !isOpen);
  };
  const optionClickHandler = (option) => {
    groupChangeHandler(option);
    setSelectedOption(option);
    setIsOpen(false);
  };
  return (
    <div className={classes.dropdown}>
      <div
        className={`${classes.select} ${
          isOpen ? classes['select-clicked'] : ''
        }`}
        onClick={selectClickHandler}
      >
        <span className="selected">{selectedOption || optionSet[0]}</span>
        <div
          className={`${classes.caret} ${
            isOpen ? classes['caret-rotate'] : ''
          }`}
        ></div>
      </div>
      <ul className={`${classes.menu} ${isOpen ? classes['menu-open'] : ''}`}>
        {list}
      </ul>
    </div>
  );
}
export default Dropdown;
