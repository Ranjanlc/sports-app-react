import { Fragment } from 'react';
import classes from './Layout.module.css';
import logo from '../assets/layout/cricket.png';
import football from '../assets/layout/layout-football.png';
import cricket from '../assets/layout/cricket.png';
import basketball from '../assets/layout/basketball.png';
import { NavLink, useLocation } from 'react-router-dom';
const Layout = (props) => {
  const { pathname } = useLocation();
  const sportClickHandler = (sport, e) => {
    // To scroll to top.
    if (pathname.includes(sport)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
            className={({ isActive }) => (isActive ? classes.active : '')}
            onClick={sportClickHandler.bind(null, 'football')}
          >
            <img src={football} alt="footballes" />
            Football
          </NavLink>
          <NavLink
            to="/cricket"
            onClick={sportClickHandler.bind(null, 'cricket')}
            className={({ isActive }) => (isActive ? classes.active : '')}
          >
            <img src={cricket} alt="cricket" />
            Cricket
          </NavLink>
          <NavLink
            to="/basketball"
            onClick={sportClickHandler.bind(null, 'basketball')}
            className={({ isActive }) => (isActive ? classes.active : '')}
          >
            <img src={basketball} alt="basketball" />
            Basketball
          </NavLink>
        </div>
      </nav>
      <main>{props.children}</main>
    </Fragment>
  );
};

export default Layout;
