import { Fragment } from 'react';
import classes from './Layout.module.css';
import logo from './logo.png';
const Layout = (props) => {
  return (
    <Fragment>
      <nav className={classes.navigation}>
        <div className={classes.list}>
          <img src={logo} className={classes.logo} alt="logo" />
          <div>
            <img src="./football.png" alt="football"></img>Football
          </div>
          <div>
            <img src="./cricket.png" alt="cricket"></img>Cricket
          </div>
          <div>
            <img src="./basketball.png" alt="basketball"></img>Basketball
          </div>
        </div>
        <button className={classes.action}>Login</button>
      </nav>
      <main>{props.children}</main>
    </Fragment>
  );
};

export default Layout;
