import classes from './Dropdown.module.css';

import React, { useState } from 'react';
import { convertSlugToDisplay } from '../../helpers/helpers';
function Dropdown(props) {
  const { optionSet, groupChangeHandler, isFootball, startingOption } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(startingOption);
  const list = optionSet.map((option) => {
    let displayOption;
    if (isFootball) {
      displayOption = convertSlugToDisplay(option);
    } else {
      displayOption = option;
    }
    return (
      <li onClick={() => optionClickHandler(option)} key={option}>
        {displayOption}
      </li>
    );
  });
  const selectClickHandler = (e) => {
    setIsOpen((isOpen) => !isOpen);
  };
  const optionClickHandler = (option) => {
    groupChangeHandler(option);
    setSelectedOption(isFootball ? convertSlugToDisplay(option) : option);
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
        <span className="selected">
          {selectedOption ||
            (isFootball ? convertSlugToDisplay(optionSet[0]) : optionSet[0])}
        </span>
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
