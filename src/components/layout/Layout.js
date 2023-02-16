import { Fragment } from 'react';
import classes from './Layout.module.css';
import logo from '../../assets/logo.png';
import { NavLink } from 'react-router-dom';
const Layout = (props) => {
  // const { onSportsChange } = props;
  // const changeHandler = (e) => {
  // e.currentTarget gives the element in which handler is attached,not where the event originated.
  // We could also attach the event handler to only the listing div and write necessary logic to get the clicked div.
  //   const sport = e.currentTarget.id;
  //   onSportsChange(sport);
  // };
  return (
    <Fragment>
      <nav className={classes.navigation}>
        <div className={classes.list}>
          <img src={logo} className={classes.logo} alt="logo" />
          <NavLink to="/football">
            <img src="./football.png" alt="football" />
            Football
          </NavLink>
          <NavLink to="/cricket">
            <img src="./cricket.png" alt="cricket" />
            Cricket
          </NavLink>
          <NavLink to="/basketball">
            <img src="./basketball.png" alt="basketball" />
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
