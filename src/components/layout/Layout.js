import { Fragment, useState } from 'react';
import classes from './Layout.module.css';
import logo from '../../assets/logo.png';
import football from '../../assets/football.png';
import cricket from '../../assets/cricket.png';
import basketball from '../../assets/basketball.png';
import { NavLink } from 'react-router-dom';
const Layout = (props) => {
  // const { onSportsChange } = props;
  // const changeHandler = (e) => {
  // e.currentTarget gives the element in which handler is attached,not where the event originated.
  // We could also attach the event handler to only the listing div and write necessary logic to get the clicked div.
  //   const sport = e.currentTarget.id;
  //   onSportsChange(sport);
  // };
  const [isLoaded, setIsLoaded] = useState(true);
  const setInitialLoaded = () => {
    if (isLoaded) {
      setIsLoaded(false);
    }
  };
  return (
    <Fragment>
      <nav className={classes.navigation}>
        <div className={classes.list}>
          <img src={logo} className={classes.logo} alt="logo" />
          {/* This all to set the link active when it is first loaded. */}
          <NavLink
            to="/football"
            className={({ isActive }) =>
              [
                isLoaded ? classes.active : null,
                isActive ? classes.active : null,
              ]
                .filter(Boolean)
                .join(' ')
            }
          >
            <img src={football} alt="football" />
            Football
          </NavLink>
          <NavLink
            to="/cricket"
            onClick={setInitialLoaded}
            className={({ isActive }) => (isActive ? classes.active : '')}
          >
            <img src={cricket} alt="cricket" />
            Cricket
          </NavLink>
          <NavLink
            to="/basketball"
            onClick={setInitialLoaded}
            className={({ isActive }) => (isActive ? classes.active : '')}
          >
            <img src={basketball} alt="basketball" />
            Basketball
          </NavLink>
        </div>
        <button className={classes.action}>Login</button>
      </nav>
      <main>{props.children}</main>
    </Fragment>
  );
};

export default Layout;
