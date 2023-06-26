import classes from './ErrorHandler.module.css';
const ErrorHandler = ({ message }) => {
  return <div className={classes.message}>{message}</div>;
};

export default ErrorHandler;
