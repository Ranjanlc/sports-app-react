import SubIn from '../../assets/sub-in';
import SubOut from '../../assets/sub-out';
import classes from './PlayerCircle.module.css';
const PlayerCircle = ({
  playerNumber,
  playerName,
  subOut,
  away,
  onlyCircle,
}) => {
  if (onlyCircle) {
    return (
      <div className={`${classes.circle} ${classes.away} `}>
        <span>{playerNumber}</span>
      </div>
    );
  }
  return (
    <div className={classes.container}>
      <div
        className={`${classes.circle} ${away ? classes.away : ''} ${
          subOut ? classes.sub : ''
        }`}
      >
        {subOut && <div className={classes['arrow-down']}></div>}
        <span>{playerNumber}</span>
      </div>
      <span>{playerName}</span>
    </div>
  );
};

export default PlayerCircle;
