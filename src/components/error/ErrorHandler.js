import classes from './ErrorHandler.module.css';
const ErrorHandler = ({ message }) => {
  console.log(message);
  return <div className={classes.message}>{message}</div>;
};

export default ErrorHandler;
